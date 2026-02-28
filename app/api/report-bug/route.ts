import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { title, severity, area, description, email } = body;

  try {
    // 1. Send to Discord via Webhook (Immediate Notification)
    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `🐞 New Bug: ${title}`,
          color: severity === 'High' ? 0xff0000 : 0xffff00,
          fields: [
            { name: "Area", value: area, inline: true },
            { name: "Severity", value: severity, inline: true },
            { name: "Reporter", value: email, inline: true },
            { name: "Description", value: description }
          ],
          footer: { text: "Swarve Internal Tracking" },
          timestamp: new Date().toISOString()
        }]
      })
    });

    // 2. Integration with DYMO API (Incident Management)
    // We only open a global incident if severity is "High"
    if (severity === 'High') {
      try {
        await fetch('https://dymo.tpeoficial.com/api/incidents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.DYMO_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `[CRITICAL] Bug in ${area}`,
            message: `Reported by ${email}: ${title}. Description: ${description}`,
            status: 'investigating',
            impact: 'partial_outage'
          }),
        });
      } catch (dymoError) {
        console.error("Dymo logging failed, but proceeding with other notifications:", dymoError);
      }
    }

    // 3. Send thank-you email with Resend
    await resend.emails.send({
      from: 'Swarve Support <support@swarve.link>', // Make sure swarve.link is verified in Resend
      to: [email],
      subject: 'Bug Report Received 🐞',
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #222;">
          <h1 style="color: #fff; font-size: 24px; margin-bottom: 20px;">Hello!</h1>
          <p style="color: #ccc; line-height: 1.6;">We have successfully received your bug report regarding: <strong>${title}</strong>.</p>
          <p style="color: #ccc; line-height: 1.6;">Our engineering team has been notified via <strong>Discord</strong> and <strong>Dymo</strong> monitoring. We are already looking into it.</p>
          <p style="color: #ccc; line-height: 1.6;">Thank you for helping us make Swarve better.</p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
          <p style="font-size: 11px; color: #666; font-family: monospace; text-transform: uppercase;">
            Technical Session ID: ${Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      `
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Critical Bug report error:", error);
    return NextResponse.json({ error: 'Failed to process report' }, { status: 500 });
  }
}