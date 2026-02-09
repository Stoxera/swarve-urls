import { turso } from "@/lib/turso";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { nanoid } from "nanoid";

/**
 * Route Handler for link redirection and analytics logging.
 * Captures visitor data (IP, Country, City) before redirecting to the destination.
 */
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  // In Next.js 15+, params must be awaited
  const { slug } = await params;

  // 1. Fetch the destination URL and link ID from the 'links' table
  const { rows } = await turso.execute({
    sql: "SELECT id, url FROM links WHERE slug = ? LIMIT 1",
    args: [slug]
  });

  // 2. Fallback to home if the slug is not found
  if (!rows || rows.length === 0) {
    redirect("/");
  }

  const link = rows[0]!;
  const linkId = link.id as string;
  const destinationUrl = link.url as string;

  // 3. Extract visitor metadata from headers
  // Vercel provides these headers automatically in production
  const ip = req.headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
  const country = req.headers.get("x-vercel-ip-country") || "Unknown";
  const city = req.headers.get("x-vercel-ip-city") || "Unknown";
  const userAgent = req.headers.get("user-agent") || "Unknown";
  const referer = req.headers.get("referer") || "Direct";

  /**
   * 4. Log analytics and update click count.
   * We use a non-awaited batch execution to ensure the user is redirected 
   * instantly without waiting for database writes.
   */
  turso.batch([
    {
      // Increment the total click counter for the link
      sql: "UPDATE links SET clicks = clicks + 1 WHERE id = ?",
      args: [linkId]
    },
    {
      // Insert detailed visitor data into the 'clicks_log' table
      sql: `INSERT INTO clicks_log (id, linkId, ip, country, city, userAgent, referer, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        nanoid(), 
        linkId, 
        ip, 
        country, 
        city, 
        userAgent, 
        referer, 
        new Date().toISOString()
      ]
    }
  ], "write").catch(err => {
    // Log error to console for debugging without interrupting user experience
    console.error("Critical Analytics Error:", err);
  });

  // 5. Final redirection to the destination URL
  redirect(destinationUrl);
}