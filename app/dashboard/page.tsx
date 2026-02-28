import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { turso } from "@/lib/turso";
import { Tags, Plus, Sparkles, ExternalLink, Pencil, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import CreateLinkModal from "@/components/CreateLinkModal";
import SearchInput from "@/components/SearchInput"; 
import DeleteLinkButton from "@/components/DeleteLinkButton";
import CopyLinkButton from "@/components/CopyLinkButton";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ query?: string; page?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) redirect("/auth");

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  
  // LÓGICA DE PAGINACIÓN
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // 1. Fetch de links con LIMIT y OFFSET
  const { rows } = await turso.execute({
    sql: `
      SELECT id, url, slug, description, clicks, userId, createdAt FROM links 
      WHERE userId = ? 
      AND (slug LIKE ? OR url LIKE ? OR description LIKE ?)
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `,
    args: [
      session.user?.id!,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      limit,
      offset
    ]
  });

  // 2. Obtener el TOTAL de links para calcular las páginas
  const countRes = await turso.execute({
    sql: `SELECT COUNT(*) as total FROM links WHERE userId = ? AND (slug LIKE ? OR url LIKE ? OR description LIKE ?)`,
    args: [session.user?.id!, `%${query}%`, `%${query}%`, `%${query}%`]
  });
  
  const totalCount = Number(countRes.rows[0]?.total || 0);
  const totalPages = Math.ceil(totalCount / limit);
  const isLimitReached = totalCount >= 30;

  const links = rows.map((row) => ({
    id: String(row.id),
    url: String(row.url),
    slug: String(row.slug),
    description: row.description ? String(row.description) : "",
    clicks: Number(row.clicks || 0),
    userId: String(row.userId),
    createdAt: String(row.createdAt),
  }));

  return (
    <main className="max-w-7xl mx-auto p-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-16">
        <SearchInput />

        <div className="flex items-center gap-3">
          <button disabled className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-[#0A0A0A] border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-400 font-medium transition-colors">
            <Tags size={14} /> Select a tag
          </button>
          
          <CreateLinkModal disabled={isLimitReached}>
            <button 
              disabled={isLimitReached}
              className={`cursor-pointer flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                isLimitReached 
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              <Plus size={14} /> {isLimitReached ? "Limit Reached" : "Create Link"}
            </button>
          </CreateLinkModal>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="mb-6 p-4 rounded-full bg-zinc-950 border border-zinc-900">
            <Sparkles size={32} className="text-zinc-700" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-medium text-zinc-200 mb-2 italic">
            {query ? "No results found" : "No links found"}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
              {query ? `Results for: ${query}` : "Recent Links"}
            </h2>
            <span className="text-[10px] text-zinc-600 font-bold bg-zinc-950 px-2 py-1 rounded border border-zinc-900 uppercase">
              Page {currentPage} of {totalPages} — {totalCount} total
            </span>
          </div>

          {links.map((link) => (
            <div key={link.id} className="group flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-[#0A0A0A] hover:border-zinc-700 transition-all">
              <div className="flex flex-col gap-1 overflow-hidden flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium italic text-lg truncate">/{link.slug}</span>
                  {link.description && <span className="text-[9px] text-zinc-600 border border-zinc-800 px-1 rounded uppercase">Note</span>}
                </div>
                <span className="text-zinc-500 text-xs truncate max-w-md">{link.url}</span>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right hidden sm:block min-w-[60px] border-r border-zinc-900 pr-4">
                    <p className="text-white text-xs font-bold leading-none">{link.clicks}</p>
                    <p className="text-zinc-600 text-[10px] uppercase tracking-tighter">Clicks</p>
                </div>

                <div className="flex items-center gap-1 bg-zinc-900/40 p-1 rounded-lg border border-zinc-800/50">
                  <CopyLinkButton slug={link.slug} />
                  <Link href={`/dashboard/analytics/${link.slug}`} className="p-2 text-zinc-500 hover:text-emerald-400 rounded-md transition-colors">
                    <BarChart3 size={16} />
                  </Link>
                  <CreateLinkModal initialData={link}>
                    <button className="cursor-pointer p-2 text-zinc-500 hover:text-blue-400 rounded-md transition-colors"><Pencil size={16} /></button>
                  </CreateLinkModal>
                  <a href={`/${link.slug}`} target="_blank" rel="noreferrer" className="p-2 text-zinc-500 hover:text-white rounded-md transition-colors">
                    <ExternalLink size={16} />
                  </a>
                  <DeleteLinkButton id={link.id} />
                </div>
              </div>
            </div>
          ))}

          {/* COMPONENTE DE PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 mb-8">
              <Link
                href={`?page=${currentPage - 1}${query ? `&query=${query}` : ""}`}
                className={`p-2 rounded-lg border border-zinc-900 transition-colors ${
                  currentPage <= 1 ? "pointer-events-none opacity-20" : "hover:bg-zinc-900 text-zinc-400"
                }`}
              >
                <ChevronLeft size={20} />
              </Link>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Link
                      key={pageNum}
                      href={`?page=${pageNum}${query ? `&query=${query}` : ""}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        currentPage === pageNum 
                        ? "bg-white text-black shadow-lg shadow-white/10" 
                        : "text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              <Link
                href={`?page=${currentPage + 1}${query ? `&query=${query}` : ""}`}
                className={`p-2 rounded-lg border border-zinc-900 transition-colors ${
                  currentPage >= totalPages ? "pointer-events-none opacity-20" : "hover:bg-zinc-900 text-zinc-400"
                }`}
              >
                <ChevronRight size={20} />
              </Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}