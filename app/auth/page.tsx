"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Link as LinkIcon, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Link from "next/link";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [accepted, setAccepted] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  
  // Estados para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const validateAccess = (action: () => void) => {
    if (!accepted) {
      toast.error("Terms Required", {
        description: "You must accept the terms and privacy policy to continue.",
        position: "top-right",
      });
      return;
    }
    action();
  };

  const handleCredentialsAuth = (e: React.FormEvent) => {
    e.preventDefault();
    validateAccess(() => {
      // Aquí llamarías a tu provider de credentials
      toast.info(mode === "login" ? "Logging in..." : "Creating account...");
      signIn("credentials", { email, password, name, callbackUrl: "/dashboard" });
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-black overflow-x-hidden select-none text-zinc-400">
      <Toaster theme="dark" closeButton />

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[340px] space-y-8">
          
          {/* LOGO */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
              <LinkIcon className="h-5 w-5 text-zinc-100" />
            </div>
            <h1 className="text-xl font-medium tracking-tight text-zinc-100 italic">Swarve.</h1>
            <p className="text-xs text-zinc-600 mt-2">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </p>
          </div>

          <div className="space-y-4">
            {/* SOCIAL LOGINS */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => validateAccess(() => signIn("discord", { callbackUrl: "/dashboard" }))}
                className="cursor-pointer flex h-11 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900 transition-all active:scale-95"
                title="Discord"
              >
                <svg className="h-5 w-5" viewBox="0 -28.5 256 256" fill="#5865F2"><path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" /></svg>
              </button>
              <button
                onClick={() => validateAccess(() => signIn("google", { callbackUrl: "/dashboard" }))}
                className="cursor-pointer flex h-11 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900 transition-all active:scale-95"
                title="Google"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-900"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-zinc-900"></div>
            </div>

            {/* FORMULARIO DINÁMICO */}
            <form onSubmit={handleCredentialsAuth} className="space-y-3">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative"
                  >
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 bg-zinc-950 border border-zinc-900 rounded-lg pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 bg-zinc-950 border border-zinc-900 rounded-lg pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 bg-zinc-950 border border-zinc-900 rounded-lg pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 text-sm font-bold text-black hover:bg-white transition-all active:scale-95"
              >
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* CHECKBOX TERMS */}
          <div className="flex flex-col items-center">
            <label className="group flex cursor-pointer items-center gap-3">
              <div className="relative flex h-5 w-5 items-center justify-center">
                <input
                  type="checkbox"
                  className="peer hidden"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <motion.div 
                  animate={{ 
                    backgroundColor: accepted ? "#f4f4f5" : "rgba(0,0,0,0)",
                    borderColor: accepted ? "#f4f4f5" : "#27272a" 
                  }}
                  className="h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors"
                >
                  {accepted && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} viewBox="0 0 24 24" className="h-3.5 w-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></motion.svg>}
                </motion.div>
              </div>
              <span className={`text-[11px] font-medium transition-colors ${accepted ? "text-zinc-400" : "text-zinc-600"}`}>
                I agree to the <Link href="/terms" className="underline underline-offset-4 decoration-zinc-900 hover:text-zinc-300">Terms</Link> & <Link href="/privacy" className="underline underline-offset-4 decoration-zinc-900 hover:text-zinc-300">Privacy</Link>
              </span>
            </label>
          </div>

          {/* TOGGLE MODE */}
          <div className="text-center">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="cursor-pointer text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              {mode === "login" ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}