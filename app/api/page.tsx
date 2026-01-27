"use client";
import Header from "@/components/Header";
import { Hammer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="relative flex-grow flex flex-col items-center justify-center px-6 overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl">
          
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 relative overflow-hidden group">
            <Hammer className="w-8 h-8 text-white animate-bounce" />
            
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
            Under Construction
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
            We are fine-tuning the last details of <span className="text-white font-medium italic underline decoration-white/20">Swarve Links</span>. 
            Come back later to enjoy the fastest link shortening experience.
          </p>

          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
            
            <div className="px-8 py-3 bg-neutral-900 text-neutral-400 rounded-full border border-white/5 text-sm">
              Estimated wait: <span className="text-white font-mono">Coming Soon</span>
            </div>
          </div>
        </div>

        
      </main>

      
    </div>
  );
}