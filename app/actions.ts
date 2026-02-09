'use server';

import { turso } from '@/lib/turso';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { authenticator } from '@otplib/preset-default';
import QRCode from 'qrcode';

/**
 * Creates a new shortened URL for the authenticated user.
 */
export async function createShortUrl(formData: FormData) {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
        return { success: false, error: "Authentication required" };
    }

    const url = formData.get('url') as string;
    const customSlug = formData.get('slug') as string;
    const description = formData.get('description') as string;

    // Validate URL format
    if (!url || !url.startsWith('http')) {
        return { success: false, error: "Invalid URL format. Must start with http/https" };
    }

    // Use custom slug if provided, otherwise generate a random one
    const slug = customSlug.trim() !== "" ? customSlug : nanoid(6);
    const userId = session.user.id;

    try {
        const id = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        await turso.execute({
            sql: "INSERT INTO links (id, url, slug, description, userId, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
            args: [id, url, slug, description || "", userId, timestamp]
        });

        revalidatePath('/dashboard');
        return { success: true };

    } catch (error: any) {
        console.error("TURSO DEBUG:", error);
        
        // Handle duplicate slug errors (SQLite UNIQUE constraint)
        if (error.message?.includes("UNIQUE constraint failed") || error.code === "SQLITE_CONSTRAINT") {
            return { success: false, error: "Slug already taken" };
        }

        return { success: false, error: "Unexpected database error" };
    }
}

/**
 * Deletes a specific link belonging to the user.
 */
export async function deleteLink(formData: FormData) {
    const session = await auth();
    const id = formData.get("id") as string | null;

    if (!session?.user?.id || !id) throw new Error("Unauthorized access");

    await turso.execute({
        sql: "DELETE FROM links WHERE id = ? AND userId = ?",
        args: [id, session.user.id]
    });

    revalidatePath('/dashboard');
}

/**
 * Fetches all user links for data export purposes.
 */
export async function getLinksForExport() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized access");

    const { rows } = await turso.execute({
        sql: "SELECT slug, url, description, clicks, createdAt FROM links WHERE userId = ? ORDER BY createdAt DESC",
        args: [session.user.id]
    });

    return rows.map(row => ({
        slug: String(row.slug),
        url: String(row.url),
        description: String(row.description || ""),
        clicks: Number(row.clicks || 0),
        createdAt: String(row.createdAt)
    }));
}

/**
 * Updates the destination URL or description of an existing link.
 */
export async function updateLink(formData: FormData) {
    const session = await auth();
    const userId = session?.user?.id;
    const id = formData.get("id") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string;

    if (!userId || !id) throw new Error("Unauthorized access");

    if (!url || !url.startsWith('http')) {
        throw new Error("Please enter a valid URL.");
    }

    try {
        await turso.execute({
            sql: "UPDATE links SET url = ?, description = ? WHERE id = ? AND userId = ?",
            args: [url, description || "", id, userId]
        });

        revalidatePath('/dashboard');
    } catch (error: any) {
        throw new Error("Failed to update link");
    }
}

/**
 * Generates 2FA setup data including the secret and QR code.
 */
export async function setup2FA() {
    const session = await auth();
    
    if (!session?.user?.email) {
        throw new Error("You must be logged in with a Discord account and share your email.");
    }

    const userEmail = session.user.email;
    const secret = authenticator.generateSecret();
    
    // Create the OTP URI for authenticator apps
    const otpauth = authenticator.keyuri(userEmail, 'Swarve', secret);
    
    try {
        const qrImageData = await QRCode.toDataURL(otpauth);
        return { 
            secret,      // For manual entry
            qrImageData, // For QR scanning
            email: userEmail 
        };
    } catch (err) {
        console.error('Error generating QR', err);
        throw new Error('Failed to generate 2FA QR code');
    }
}

/**
 * Verifies the 6-digit TOTP token and enables 2FA in the database.
 */
export async function verifyAndEnable2FA(token: string, secret: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const isValid = authenticator.check(token, secret);
    
    if (isValid) {
        // Update user record in Turso
        await turso.execute({
            sql: "UPDATE users SET twoFactorSecret = ?, twoFactorEnabled = 1 WHERE id = ?",
            args: [secret, session.user.id]
        });
        return { success: true };
    }
    
    return { success: false, error: "Invalid verification code" };
}

/**
 * Disables 2FA by verifying the current token first.
 */
export async function disable2FA(token: string, savedSecret: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const isValid = authenticator.check(token, savedSecret);
    
    if (isValid) {
        // Clear 2FA credentials in Turso
        await turso.execute({
            sql: "UPDATE users SET twoFactorEnabled = 0, twoFactorSecret = NULL WHERE id = ?",
            args: [session.user.id]
        });
        return { success: true };
    }
    
    return { success: false, error: "Invalid code. Identity not verified." };
}