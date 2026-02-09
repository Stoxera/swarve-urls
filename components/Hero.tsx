"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Globe } from "lucide-react";

function BackgroundEffect() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Grid técnica */}
      <div 
        className="absolute inset-0 opacity-[0.2]" 
        style={{
          backgroundImage: `linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 30%, transparent 100%)',
        }} 
      />
      
      {/* Glow principal esmeralda */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px]" />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white px-4 pt-32 pb-20 overflow-hidden">
      <BackgroundEffect />

      <div className="mx-auto max-w-6xl text-center relative z-10">
        
        {/* Badge Pro con gradiente animado */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 backdrop-blur-sm"
        >
          <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            Network Status: High CPM Active
          </span>
        </motion.div>

        {/* Título: Tipografía masiva y agresiva */}
        <motion.h1 
          className="mb-6 text-balance text-6xl font-black tracking-tighter md:text-8xl lg:text-9xl uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-white">Swarve</span>
          <span className="text-emerald-500 inline-flex items-center">
            <Zap className="h-12 w-12 md:h-20 md:w-20 fill-current mx-2" />
            Link
          </span>
          <br />
          <span className="text-zinc-800 outline-text">Protocol</span>
        </motion.h1>
        
        {/* Descripción refinada */}
        <motion.p 
          className="mx-auto mb-12 max-w-2xl text-lg text-zinc-500 md:text-xl font-medium leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          The most advanced link monetization layer. Real-time arbitrage, 
          anti-fraud protection, and instant global payouts.
        </motion.p>

        {/* Botones estilo "Cyberpunk Clean" */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button size="lg" className="group h-14 w-full sm:w-auto px-10 bg-white hover:bg-emerald-500 text-black font-black rounded-none transition-all duration-300" asChild>
            <Link href="/auth/sign-up">
              DEPLOY NOW
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button 
            size="lg"
            variant="outline" 
            className="h-14 w-full sm:w-auto px-10 border-zinc-800 bg-transparent hover:bg-zinc-900 text-white font-bold rounded-none transition-all"
            asChild
          >
            <Link href="/docs">READ MANIFESTO</Link>
          </Button>
        </motion.div>

        {/* Features rápidas debajo del Hero */}
        <motion.div 
          className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-zinc-900 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="text-emerald-500 h-5 w-5" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Enterprise Security</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe className="text-emerald-500 h-5 w-5" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Payouts</span>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2">
            <Zap className="text-emerald-500 h-5 w-5" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Low Latency</span>
          </div>
        </motion.div>

      </div>

      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px #27272a;
          color: transparent;
        }
      `}</style>
    </section>
  );
}