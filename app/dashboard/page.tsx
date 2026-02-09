import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { turso } from "@/lib/turso";
import { Tags, Plus, Sparkles, ExternalLink, Pencil, BarChart3 } from "lucide-react";
import CreateLinkModal from "@/components/CreateLinkModal";
import SearchInput from "@/components/SearchInput"; 
import DeleteLinkButton from "@/components/DeleteLinkButton"; 
import Link from "next/link";

// Definimos el tipo de props para Next.js 15 (searchParams es una Promesa)
interface PageProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) redirect("/auth");

  // ARREGLO: Unwrapping de searchParams (obligatorio en Next.js 15)
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";

  // 1. Fetch de links desde Turso
  const { rows } = await turso.execute({
    sql: `
      SELECT id, url, slug, description, clicks, userId, createdAt FROM links 
      WHERE userId = ? 
      AND (slug LIKE ? OR url LIKE ? OR description LIKE ?)
      ORDER BY createdAt DESC
    `,
    args: [
      session.user?.id!,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`
    ]
  });

  // 2. SERIALIZACIÓN: Convertimos los resultados a objetos planos de JS
  const links = rows.map((row) => ({
    id: String(row.id),
    url: String(row.url),
    slug: String(row.slug),
    description: row.description ? String(row.description) : "",
    clicks: Number(row.clicks || 0),
    userId: String(row.userId),
    createdAt: String(row.createdAt),
  }));

  const totalLinks = links.length;
  const isLimitReached = totalLinks >= 30;

  return (
    <main className="max-w-7xl mx-auto p-6">
      
      {/* HEADER: Buscador y Botón de Crear */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-16">
        <SearchInput />

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#0A0A0A] border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-400 font-medium hover:bg-zinc-900 transition-colors">
            <Tags size={14} /> Select a tag
          </button>
          
          <CreateLinkModal disabled={isLimitReached}>
            <button 
              disabled={isLimitReached}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all shadow-lg ${
                isLimitReached 
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none" 
                : "bg-white text-black hover:bg-zinc-200 shadow-white/5"
              }`}
            >
              <Plus size={14} /> {isLimitReached ? "Limit Reached" : "Create Link"}
            </button>
          </CreateLinkModal>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {totalLinks === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="mb-6 p-4 rounded-full bg-zinc-950 border border-zinc-900">
            <Sparkles size={32} className="text-zinc-700" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-medium text-zinc-200 mb-2 italic">
            {query ? "No results found" : "No links found"}
          </h3>
          <p className="text-zinc-500 text-sm mb-8 text-center max-w-xs">
            {query 
              ? `We couldn't find any links matching "${query}".`
              : "It looks like you don't have any links yet. Start by shortening one now."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* Contador superior */}
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
              {query ? `Results for: ${query}` : "Recent Links"}
            </h2>
            <span className="text-[10px] text-zinc-600 font-bold bg-zinc-950 px-2 py-1 rounded border border-zinc-900">
              {totalLinks} {totalLinks === 1 ? 'LINK' : 'LINKS'}
            </span>
          </div>

          {/* Lista de Enlaces */}
          {links.map((link) => (
            <div 
              key={link.id} 
              className="group flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-[#0A0A0A] hover:border-zinc-700 transition-all shadow-sm"
            >
              {/* Info del Link */}
              <div className="flex flex-col gap-1 overflow-hidden flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-white font-medium italic text-lg truncate">
                        /{link.slug} 
                    </span>
                    {link.description && (
                        <span className="text-[9px] text-zinc-600 border border-zinc-800 px-1 rounded uppercase tracking-tighter">
                            Note
                        </span>
                    )}
                </div>
                <span className="text-zinc-500 text-xs truncate max-w-[200px] sm:max-w-md">
                  {link.url}
                </span>
              </div>
              
              {/* Seccion Derecha: Clics + Botones */}
              <div className="flex items-center gap-3 ml-4">
                
                {/* Contador de Clics */}
                <div className="text-right hidden sm:block min-w-[60px] border-r border-zinc-900 pr-4">
                    <p className="text-white text-xs font-bold leading-none">{link.clicks}</p>
                    <p className="text-zinc-600 text-[10px] uppercase tracking-tighter">Clicks</p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 bg-zinc-900/40 p-1 rounded-lg border border-zinc-800/50">
                  
                  {/* Ir a Analíticas */}
                  <Link 
                    href={`/dashboard/analytics/${link.slug}`}
                    className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-colors"
                  >
                    <BarChart3 size={16} />
                  </Link>

                  {/* Editar */}
                  <CreateLinkModal initialData={link}>
                    <button 
                      className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                  </CreateLinkModal>

                  {/* Abrir Link Original */}
                  <a 
                    href={`/${link.slug}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>

                  {/* Borrar con Confirmación */}
                  <DeleteLinkButton id={link.id} />

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}