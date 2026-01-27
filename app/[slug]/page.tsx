
import { redirect } from 'next/navigation';
import { turso } from '@/lib/turso';


export default async function RedirectPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
 
  const { slug } = await params;

 
  const result = await turso.execute({
    sql: "SELECT url FROM links WHERE slug = ?",
    args: [slug]
  });

  const link = result.rows[0];

  if (!link || !link.url) {
    redirect('/'); 
  }

  
  await turso.execute({
    sql: "UPDATE links SET clicks = clicks + 1 WHERE slug = ?",
    args: [slug]
  });

  redirect(link.url as string);
}