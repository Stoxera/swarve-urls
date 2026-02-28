import { NextResponse } from 'next/server'; // FIX: Importación faltante
import { turso } from '@/lib/turso';
import { verifyUrlSafety } from '@/lib/dymo';

export async function POST(req: Request) {
  try {
    const { url, slug } = await req.json();

    if (!url || !slug) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. ESCANEO DE SEGURIDAD CON DYMO
    const scan = await verifyUrlSafety(url);

    if (!scan.safe) {
      // Notificamos a Discord sobre el intento de Phishing (Opcional)
      if (process.env.DISCORD_WEBHOOK_URL) {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: "🛡️ Phishing Blocked",
              color: 0xff0000,
              fields: [
                { name: "Target URL", value: url },
                { name: "Reason", value: scan.reason || 'Malicious content' }
              ],
              timestamp: new Date().toISOString()
            }]
          })
        });
      }

      return NextResponse.json({ 
        error: 'Security Alert', 
        message: 'This URL has been flagged as unsafe and cannot be shortened.' 
      }, { status: 403 });
    }

    // 2. CREACIÓN EN TURSO
    await turso.execute({
      sql: "INSERT INTO links (url, slug, clicks) VALUES (?, ?, 0)",
      args: [url, slug]
    });

    return NextResponse.json({ success: true, slug });

  } catch (error: any) {
    console.error("Link creation error:", error);
    
    // Manejo de error de slug duplicado
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}