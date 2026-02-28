'use server';

import { turso } from '@/lib/turso';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { authenticator } from '@otplib/preset-default';
import QRCode from 'qrcode';
import { verifyUrlSafety } from '@/lib/dymo';
import { getUrlMetadata, validateUrlFormat, categorizeUrl } from '@/lib/external-apis';

/**
 * Creates a new shortened URL with full security scan and metadata enrichment.
 */
export async function createShortUrl(formData: FormData) {
    const session = await auth();

    // 1. Authentication Check
    if (!session?.user?.id) {
        return { success: false, error: "Authentication required" };
    }

    const url = formData.get('url') as string;
    const customSlug = formData.get('slug') as string;
    const description = formData.get('description') as string;

    // 2. Format Validation (Abstract API)
    const isValidFormat = await validateUrlFormat(url);
    if (!url || !url.startsWith('http') || !isValidFormat) {
        return { success: false, error: "Invalid or unreachable URL format." };
    }

    // 3. Security Scan (Dymo SDK)
    const scan = await verifyUrlSafety(url);
    if (!scan.safe) {
        return { 
            success: false, 
            error: "Security Alert", 
            details: scan.reason || "This URL has been flagged as malicious." 
        };
    }

    // 4. Metadata & Categorization (Parallel Processing)
    const [metadata, classification] = await Promise.all([
        getUrlMetadata(url),
        categorizeUrl(url)
    ]);

    // 5. Database Preparation
    const slug = customSlug.trim() !== "" ? customSlug : nanoid(6);
    const userId = session.user.id;
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    try {
        await turso.execute({
            sql: `INSERT INTO links (
                id, url, slug, description, userId, createdAt, clicks, 
                title, image, category, logo
            ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
            args: [
                id, 
                url, 
                slug, 
                description || "", 
                userId, 
                timestamp,
                metadata?.title || null,
                metadata?.image || null,
                classification?.category || "General",
                classification?.logo || null
            ]
        });

        revalidatePath('/dashboard');
        return { success: true };

    } catch (error: any) {
        console.error("Database Error:", error);
        if (error.message?.includes("UNIQUE constraint failed")) {
            return { success: false, error: "Custom slug already in use." };
        }
        return { success: false, error: "An unexpected error occurred." };
    }
}

/**
 * Fetches all links for the currently logged-in user to display in the dashboard.
 */
export async function getUserLinks() {
    const session = await auth();
    const userId = session?.user?.id;

    // If there is no session, return empty array to avoid errors
    if (!userId) {
        console.error("Dashboard Access: No session found");
        return [];
    }

    try {
        const { rows } = await turso.execute({
            sql: "SELECT * FROM links WHERE userId = ? ORDER BY createdAt DESC",
            args: [userId]
        });

        // Map the rows to a clean array of objects
        return rows.map(row => ({
            id: String(row.id),
            url: String(row.url),
            slug: String(row.slug),
            description: String(row.description || ""),
            clicks: Number(row.clicks || 0),
            createdAt: String(row.createdAt),
            title: String(row.title || ""),
            image: String(row.image || ""),
            category: String(row.category || "General"),
            logo: String(row.logo || "")
        }));
    } catch (error) {
        console.error("Database Fetch Error:", error);
        return [];
    }
}

/**
 * Updates an existing link. Re-scans security if the URL is modified.
 */
export async function updateLink(formData: FormData) {
    const session = await auth();
    const userId = session?.user?.id;
    const id = formData.get("id") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string;

    if (!userId || !id) return { success: false, error: "Unauthorized" };

    try {
        // Re-verify security for the new URL
        const scan = await verifyUrlSafety(url);
        if (!scan.safe) return { success: false, error: "New URL is unsafe." };

        const [metadata, classification] = await Promise.all([
            getUrlMetadata(url),
            categorizeUrl(url)
        ]);

        await turso.execute({
            sql: `UPDATE links SET 
                url = ?, description = ?, title = ?, image = ?, category = ?, logo = ? 
                WHERE id = ? AND userId = ?`,
            args: [
                url, 
                description || "", 
                metadata?.title || null, 
                metadata?.image || null,
                classification?.category || "General",
                classification?.logo || null,
                id, 
                userId
            ]
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update link." };
    }
}

/**
 * Deletes a link and revalidates dashboard.
 */
export async function deleteLink(formData: FormData) {
    const session = await auth();
    const id = formData.get("id") as string;

    if (!session?.user?.id || !id) return { success: false, error: "Unauthorized" };

    try {
        await turso.execute({
            sql: "DELETE FROM links WHERE id = ? AND userId = ?",
            args: [id, session.user.id]
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Deletion failed." };
    }
}

/**
 * Data retrieval for CSV/JSON export.
 */
export async function getLinksForExport() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const { rows } = await turso.execute({
        sql: "SELECT slug, url, category, clicks, createdAt FROM links WHERE userId = ? ORDER BY createdAt DESC",
        args: [session.user.id]
    });

    return rows.map(row => ({
        slug: String(row.slug),
        url: String(row.url),
        category: String(row.category || ""),
        clicks: Number(row.clicks || 0),
        createdAt: String(row.createdAt)
    }));
}

/* --- 2FA MANAGEMENT --- */

export async function setup2FA() {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Email required.");

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(session.user.email, 'Swarve', secret);
    
    const qrImageData = await QRCode.toDataURL(otpauth);
    return { secret, qrImageData, email: session.user.email };
}

export async function verifyAndEnable2FA(token: string, secret: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    if (authenticator.check(token, secret)) {
        await turso.execute({
            sql: "UPDATE users SET twoFactorSecret = ?, twoFactorEnabled = 1 WHERE id = ?",
            args: [secret, session.user.id]
        });
        return { success: true };
    }
    return { success: false, error: "Invalid token." };
}

export async function disable2FA(token: string, savedSecret: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    if (authenticator.check(token, savedSecret)) {
        await turso.execute({
            sql: "UPDATE users SET twoFactorEnabled = 0, twoFactorSecret = NULL WHERE id = ?",
            args: [session.user.id]
        });
        return { success: true };
    }
    return { success: false, error: "Invalid token." };
}