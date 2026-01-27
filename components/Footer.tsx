import Link from "next/link";
import { X } from "lucide-react"; 

export default function Footer() {
  return (
    <footer className="w-full bg-black py-4 border-t border-zinc-900/50">
      <div className="mx-auto max-w-7xl px-6 flex flex-row justify-between items-center">
        
        
        <div className="text-[10px] tracking-widest text-zinc-600 uppercase flex items-center gap-1.5 font-medium">
          <span className="text-red-600">❤️</span>
          <span>Made by</span>
          <Link 
            href="https://swarve.lol" 
            target="_blank"
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Sowy
          </Link>
          <span>and</span>
          <Link 
            href="https://stoxera.site" 
            target="_blank"
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Stoxera
          </Link>
        </div>

        
        <Link 
          href="https://x.com/diegoodev_" 
          target="_blank"
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-200 transition-colors group"
        >
          <span className="text-[10px] tracking-widest uppercase font-medium">Twitter</span>
          <X size={12} className="group-hover:scale-110 transition-transform" />
        </Link>

      </div>
    </footer>
  );
}