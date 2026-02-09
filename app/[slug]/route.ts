import { turso } from "@/lib/turso";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { nanoid } from "nanoid";

// Usamos GET para que funcione como Route Handler (API Redirector)
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  // En Next.js 15+, params es una Promesa
  const { slug } = await params;

  // 1. Buscamos el link en la base de datos
  const { rows } = await turso.execute({
    sql: "SELECT id, url FROM links WHERE slug = ? LIMIT 1",
    args: [slug]
  });

  // 2. Si no existe, mandamos al home
  if (!rows || rows.length === 0) {
    redirect("/");
  }

  const firstRow = rows[0]!;
  const linkId = firstRow.id as string;
  const destinationUrl = firstRow.url as string;

  // 3. Capturamos metadata para analíticas detalladas
  const country = req.headers.get("x-vercel-ip-country") || "Unknown";
  const userAgent = req.headers.get("user-agent") || "Unknown";

  // 4. Ejecutamos ambas actualizaciones en un solo proceso (Batch)
  // No usamos 'await' en el batch para que la redirección sea instantánea para el usuario
  turso.batch([
    {
      sql: "UPDATE links SET clicks = clicks + 1 WHERE id = ?",
      args: [linkId]
    },
    {
      sql: "INSERT INTO clicks (id, linkId, slug, userAgent, country) VALUES (?, ?, ?, ?, ?)",
      args: [nanoid(), linkId, slug, userAgent, country]
    }
  ], "write").catch(err => {
    console.error("Analytics Error:", err);
  });

  // 5. Redirección final
  redirect(destinationUrl);
}