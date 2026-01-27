import { turso } from "@/lib/turso";
import { Trash2, ExternalLink } from "lucide-react";
import { deleteLink } from "@/app/actions";


interface LinkRow {
  id: number;
  url: string;
  slug: string;
  clicks: number;
  userId: string;
}

export default async function MyLinksList({ userId }: { userId: string }) {
  const result = await turso.execute({
    sql: "SELECT id, url, slug, clicks, userId FROM links WHERE userId = ? ORDER BY createdAt DESC",
    args: [userId]
  });

 
  const links = result.rows as unknown as LinkRow[];

  if (links.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-zinc-800 rounded-xl">
        <p className="text-zinc-600 text-sm italic">No hay links todavía. ¡Crea el primero arriba!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        
        <div key={link.id.toString()} className="group flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-zinc-700 transition shadow-sm">
          <div className="flex flex-col overflow-hidden mr-4">
            <span className="text-zinc-200 font-mono text-lg font-bold leading-tight">
              /{link.slug}
            </span>
            <span className="text-zinc-500 text-xs truncate max-w-[200px] md:max-w-xs mt-1">
              {link.url}
            </span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-1 rounded-md mr-2 hidden sm:block">
              {link.clicks} clicks
            </span>
            
            <a 
              href={`/${link.slug}`} 
              target="_blank" 
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
              title="Visitar link"
            >
              <ExternalLink size={18} />
            </a>
            
            <form action={deleteLink}>
              
              <input type="hidden" name="id" value={link.id.toString()} />
              <button 
                type="submit"
                className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                title="Eliminar link"
              >
                <Trash2 size={18} />
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}