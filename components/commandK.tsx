"use client";

import * as React from "react";
import { Command } from "cmdk";
import { 
  Search, 
  Home, 
  LayoutDashboard, 
  Settings, 
  FileText, 
  BookOpen, 
  Zap,
  Command as CommandIcon,
  Scale, 
  ShieldCheck 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DialogTitle } from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function CommandK() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-3 px-3 h-9 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all"
      >
        <Search size={14} className="text-zinc-500 group-hover:text-zinc-300" />
        <span className="hidden sm:inline text-[11px] text-zinc-500 font-medium tracking-tight">
          Search...
        </span>
        <kbd className="hidden sm:flex h-5 items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[9px] text-zinc-400">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 animate-in fade-in duration-200"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Command Menu</DialogTitle>
        </VisuallyHidden.Root>

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        
        <div className="relative w-full max-w-[600px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#0A0A0A] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex items-center border-b border-zinc-900 px-4">
            <CommandIcon className="mr-3 text-zinc-600" size={16} />
            <Command.Input
              placeholder="What do you need?"
              className="flex h-14 w-full bg-transparent py-4 text-sm outline-none text-zinc-200 placeholder:text-zinc-600"
            />
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
            <Command.Empty className="py-12 text-center text-sm text-zinc-600 italic">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="px-3 py-2 text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
              <Item icon={<Home size={15} />} label="Home" onSelect={() => runCommand(() => router.push("/"))} />
              <Item icon={<LayoutDashboard size={15} />} label="Dashboard" onSelect={() => runCommand(() => router.push("/dashboard"))} />
              <Item icon={<Settings size={15} />} label="Settings" onSelect={() => runCommand(() => router.push("/dashboard/settings"))} />
            </Command.Group>

            <Command.Group heading="Resources" className="px-3 py-2 text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em] border-t border-zinc-900/50 mt-2 pt-4">
              <Item icon={<BookOpen size={15} />} label="Documentation" onSelect={() => runCommand(() => router.push("https://docs.swarve.link/"))} />
              <Item icon={<Zap size={15} />} label="Support" onSelect={() => runCommand(() => router.push("https://discord.com/invite/wujYrZ3JPH"))} />
              <Item icon={<FileText size={15} />} label="API Reference" onSelect={() => runCommand(() => router.push("/api"))} />
            </Command.Group>

            
            <Command.Group heading="Legal" className="px-3 py-2 text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em] border-t border-zinc-900/50 mt-2 pt-4">
              <Item icon={<Scale size={15} />} label="Terms of Service" onSelect={() => runCommand(() => router.push("/terms"))} />
              <Item icon={<ShieldCheck size={15} />} label="Privacy Policy" onSelect={() => runCommand(() => router.push("/privacy"))} />
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-zinc-900 bg-zinc-950/50 px-4 py-3 text-[10px] text-zinc-600">
              <div className="flex gap-4">
                <span><kbd className="font-sans border border-zinc-800 rounded px-1">↑↓</kbd> Navigate</span>
                <span><kbd className="font-sans border border-zinc-800 rounded px-1">↵</kbd> Select</span>
              </div>
              <span>Swarve Interface</span>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}

function Item({ icon, label, onSelect }: { icon: React.ReactNode; label: string; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 aria-selected:bg-zinc-900 aria-selected:text-white transition-all duration-200"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 group-aria-selected:border-zinc-700">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </Command.Item>
  );
}