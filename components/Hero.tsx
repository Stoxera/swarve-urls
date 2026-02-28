"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white text-black px-4 pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.4]" 
          style={{
            backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, #000 10%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, #000 10%, transparent 100%)',
          }} 
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white shadow-sm mb-12 cursor-pointer hover:bg-zinc-50 transition-colors"
        >
          <span className="bg-black text-[10px] font-bold text-white px-1.5 py-0.5 rounded uppercase">New</span>
          <span className="text-xs font-medium text-zinc-600 flex items-center gap-1">
            🚀 Dashboard & Marketing UI Blocks, AI Theme Generator, and more... <Sparkles size={12} className="text-orange-500" />
          </span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] text-zinc-900"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Build Futuristic UIs with <br />
          <span className="relative">
            Swarve Link
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-zinc-300" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
          <br />
          at Warp Speed ⚡
        </motion.h1>

        <motion.p 
          className="mx-auto max-w-2xl text-zinc-500 text-lg md:text-xl mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Accelerate your project development with ready-to-use, and fully customizable link 
          <span className="font-semibold text-zinc-800"> Components, Blocks, UI Kits and Themes</span> with AI Tools 🪄.
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-zinc-200 overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex text-orange-500">
              {[1, 2, 3, 4, 5].map((i) => <Sparkles key={i} size={14} className="fill-current" />)}
              <span className="ml-2 text-sm font-bold text-zinc-900">4.5</span>
            </div>
            <p className="text-xs text-zinc-500 font-medium tracking-tight uppercase">Loved by industry creators</p>
          </div>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button size="lg" className="h-14 px-8 bg-[#18181b] hover:bg-black text-white rounded-xl shadow-xl shadow-zinc-200 transition-all flex items-center gap-2 group" asChild>
            <Link href="/dashboard">
              Get all access <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            </Link>
          </Button>
          
          <Button size="lg"  className="h-14 px-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl transition-all flex items-center gap-2" asChild>
            <Link href="/explore">
              Explore more <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}