"use client";

import Link from "next/link";
import { LinkIcon, Shield, Zap, BarChart3, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";


export default function Home() {
  const features = [
    {
      title: "Lightning Fast",
      desc: "Optimized redirection engine for zero latency.",
      icon: <Zap size={20} />,
    },
    {
      title: "Secure by Default",
      desc: "Enterprise-grade protection for every link.",
      icon: <Shield size={20} />,
    },
    {
      title: "Real-time Analytics",
      desc: "Deep insights into your link performance.",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <div className="flex flex-col bg-black text-white selection:bg-zinc-800">
      <Header />
      
      <main className="flex flex-col items-center">
       
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden w-full">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-zinc-900/20 blur-[120px] rounded-full" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <h1 className="text-7xl md:text-[120px] font-medium tracking-tighter leading-[0.8] mb-8 italic">
              Swarve<span className="text-zinc-500">.</span>
            </h1>
            
            <p className="max-w-[460px] text-zinc-500 text-lg md:text-xl leading-relaxed mb-10 font-light tracking-tight">
              The minimalist standard for modern link infrastructure. 
              Built for speed, designed for clarity.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <Link 
                href="/auth" 
                className="group flex h-14 items-center justify-center gap-3 rounded-full bg-zinc-100 px-10 text-sm font-bold text-black transition-all hover:bg-white active:scale-95"
              >
                Get Started
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link 
                href="#features" 
                className="text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                Explore Features
              </Link>
            </div>
          </motion.div>
        </section>

        
        <section id="features" className="w-full max-w-7xl px-6 py-32 border-t border-zinc-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950/30 hover:bg-zinc-900/20 transition-all"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-black text-zinc-400 group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-medium mb-3 text-zinc-100">{f.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        
        <section className="py-40 text-center">
             <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">Ready to swarve?</h2>
             <Link 
                href="/auth" 
                className="text-zinc-400 hover:text-white border-b border-zinc-800 hover:border-white pb-1 transition-all text-xl"
             >
                Create your first link →
             </Link>
        </section>
      </main>

      
    </div>
  );
}