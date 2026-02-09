import Link from "next/link";
import { Github, Search, Moon, Link as LinkIcon, Settings, Home, LayoutDashboard, Bug, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "sonner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-900/50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 bg-white rounded flex items-center justify-center">
               <LinkIcon size={14} className="text-black" />
            </div>
            <span className="font-bold tracking-tighter text-lg">swarve</span>
          </Link>
          <nav className="flex items-center gap-6 ml-4">
             <Link href="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Links</Link>
             <Link href="/dashboard/settings" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Settings</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Github size={19} className="text-zinc-500 hover:text-white cursor-pointer" />
          <Search size={19} className="text-zinc-500 hover:text-white cursor-pointer" />
          <Moon size={19} className="text-zinc-500 hover:text-white cursor-pointer" />
          
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer outline-none">
              <img 
                src={session?.user?.image || ""} 
                className="h-8 w-8 rounded-full border border-zinc-800"
                alt="User"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem className="cursor-pointer" asChild><Link href="/"><Home className="cursor-pointer mr-2 h-4 w-4"/> Home</Link></DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild><Link href="/dashboard"><LayoutDashboard className="cursor-pointer mr-2 h-4 w-4"/> Dashboard</Link></DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild><Link href="/dashboard/settings"><Settings className="cursor-pointer mr-2 h-4 w-4"/> Settings</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild><Link href="/dashboard/bugs"><Bug className="cursor-pointer mr-2 h-4 w-4"/> Report Bug</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={async () => { "use server"; await signOut(); }}>
                <button className="cursor-pointer w-full flex items-center p-2 text-sm text-red-400 hover:bg-red-950/20 rounded-md">
                  <LogOut className="mr-2 h-4 w-4"/> Logout
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}