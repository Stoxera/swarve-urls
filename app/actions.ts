'use server'

import { turso } from '@/lib/turso';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

export async function createShortUrl(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, error: "Authentication required" };
    }

    const url = formData.get('url') as string;
    const customSlug = formData.get('slug') as string;
    const description = formData.get('description') as string;

    if (!url || !url.startsWith('http')) {
        return { success: false, error: "Invalid URL format" };
    }

    const slug = customSlug.trim() !== "" ? customSlug : nanoid(6);
    const userId = session.user.id;

    try {
        const id = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        await turso.execute({
            sql: "INSERT INTO links (id, url, slug, description, userId, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
            args: [
                id,
                url,
                slug,
                description || "",
                userId,
                timestamp
            ]
        });

        revalidatePath('/dashboard');
        return { success: true };

    } catch (error: any) {
        console.error("TURSO DEBUG:", error);
        
        
        if (error.message?.includes("UNIQUE constraint failed") || error.code === "SQLITE_CONSTRAINT") {
            return { success: false, error: "Slug already taken" };
        }

        return { success: false, error: "Unexpected database error" };
    }
}

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