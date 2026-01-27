import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { turso } from "@/lib/turso";
import { Search, Package, Tags, Plus, Sparkles, ExternalLink, Trash2 } from "lucide-react";
import CreateLinkModal from "@/components/CreateLinkModal";
import { deleteLink } from "@/app/actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth");

  // Fetch links
  const { rows: links } = await turso.execute({
    sql: "SELECT * FROM links WHERE userId = ? ORDER BY createdAt DESC",
    args: [session.user?.id!]
  });

  const totalLinks = links.length;
  const isLimitReached = totalLinks >= 30;

  return (
    <main className="max-w-7xl mx-auto p-6">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-16">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={15} />
          <input 
            type="text" 
            placeholder="Search links" 
            className="w-full bg-[#0A0A0A] border border-zinc-900 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-zinc-700 outline-none transition-all text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* <div className={`flex items-center gap-2 bg-[#0A0A0A] border rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            isLimitReached ? "border-red-500/50 text-red-400" : "border-zinc-900 text-zinc-400"
          }`}>
            <Package size={14} /> 
            <span>{String(totalLinks).padStart(2, '0')}/30</span>
          </div> */}
          

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

      
      {totalLinks === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="mb-6 p-4 rounded-full bg-zinc-950 border border-zinc-900">
            <Sparkles size={32} className="text-zinc-700" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-medium text-zinc-200 mb-2 italic">No links found</h3>
          <p className="text-zinc-500 text-sm mb-8 text-center max-w-xs">
            It looks like you don't have any links yet. Start by shortening one now.
          </p>
          <CreateLinkModal>
            <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-6 py-2.5 rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-all">
              <Plus size={16} /> Create your first link
            </button>
          </CreateLinkModal>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Recent Links</h2>
          {links.map((link: any) => (
            <div key={link.id} className="group flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-[#0A0A0A] hover:border-zinc-700 transition-all">
              <div className="flex flex-col gap-1">
                <span className="text-white font-medium flex items-center gap-2 italic">
                  /{link.slug} 
                  <a href={`/${link.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink size={12} className="text-zinc-600 hover:text-white transition-colors" />
                  </a>
                </span>
                <span className="text-zinc-500 text-xs truncate max-w-md">{link.url}</span>
                {link.description && (
                  <span className="text-zinc-600 text-[11px] mt-1 italic">{link.description}</span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-white text-xs font-bold">{link.clicks || 0}</p>
                    <p className="text-zinc-600 text-[10px] uppercase">Clicks</p>
                </div>
                <form action={deleteLink}>
                  <input type="hidden" name="id" value={link.id} />
                  <button className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}