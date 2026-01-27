"use client";

import * as React from "react";
import Link from "next/link";
import { Github, ArrowRight, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import CommandK from "@/components/commandK";

export default function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 border-b",
      scrolled 
        ? "border-zinc-800/50 bg-black/80 backdrop-blur-xl py-2" 
        : "border-transparent bg-transparent py-4"
    )}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        
        
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 transition-transform group-hover:scale-110 group-active:scale-95">
              <LinkIcon size={14} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-xl font-medium tracking-tighter text-white italic">
              Swarve<span className="text-zinc-500 font-normal">.</span>
            </span>
          </Link>

          
          <div className="hidden md:flex items-center gap-6 ml-4">
            <Link href="/#features" className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200 transition-colors">
              Pricing
            </Link>
          </div>
        </div>

        
        <div className="flex items-center gap-2">
          
          <CommandK />

          <a
            href="https://github.com/Stoxera/swarve-urls"
            target="_blank"
            className="hidden sm:flex h-9 w-9 items-center justify-center text-zinc-500 hover:text-white transition-colors"
          >
            <Github size={18} strokeWidth={1.5} />
          </a>

          <div className="h-4 w-[1px] bg-zinc-800 mx-2 hidden sm:block" />

          <Link
            href="/auth"
            className="group flex h-9 items-center gap-2 rounded-full bg-white px-5 text-[12px] font-bold text-black transition-all hover:bg-zinc-200 active:scale-95"
          >
            Sign In
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}