"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { DropdownContent } from './DropdownContent';

interface DropdownItem {
  name: string;
  description: string;
  href: string;
  icon: React.FC<any>; 
}

interface DropdownMenuProps {
  menuId: string;
  content: DropdownItem[];
  leftPosition: string; 
}

// Reemplaza tus cardVariants con este código:
const cardVariants = {
  initial: { 
    opacity: 0, 
    y: 10, 
    scale: 0.95, 
    filter: "blur(10px)" 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    transition: {
      type: "spring", // Ahora TS sabrá que es exactamente "spring"
      stiffness: 300,
      damping: 24
    }
  },
  exit: { 
    opacity: 0, 
    y: 10, 
    scale: 0.95, 
    filter: "blur(10px)",
    transition: { duration: 0.2, ease: "easeIn" } 
  },
} as const; // <--- ESTO ES LA CLAVE PARA ARREGLAR EL ERROR 2322

export function DropdownMenu({ menuId, content }: DropdownMenuProps) {
  return (
    <div 
      className="absolute top-full left-0 w-full flex justify-center pt-4 pointer-events-none"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        key={menuId}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="
          relative pointer-events-auto
          w-[95%] lg:w-auto lg:min-w-[600px]
          bg-zinc-950/80 backdrop-blur-xl
          border border-zinc-800/50 rounded-[32px]
          shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]
          p-6 lg:p-8 overflow-hidden
        "
      >
        {/* Gradiente de luz sutil de fondo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[80px] pointer-events-none" />
        
        {/* Línea decorativa superior estilo "Apple" */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="relative z-10">
          <DropdownContent content={content} />
        </div>

        {/* Footer del Menú opcional o decorativo */}
        <div className="mt-6 pt-4 border-t border-zinc-900/50 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                Swarve Protocol v1.0
            </span>
            <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
                <div className="w-1 h-1 rounded-full bg-emerald-500/20" />
            </div>
        </div>
      </motion.div>
    </div>
  );
}