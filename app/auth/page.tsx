"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Link as LinkIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Link from "next/link";

export default function AuthPage() {
  const [accepted, setAccepted] = useState(false);

  
  const validateAccess = (action: () => void) => {
    if (!accepted) {
      toast.error("Terms Required", {
        description: "You must accept the terms and privacy policy to access the dashboard.",
        position: "top-right",
      });
      return;
    }
    action();
  };

  return (
    <div className="flex h-screen flex-col bg-black overflow-hidden select-none">
      
      <Toaster theme="dark" closeButton />

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[340px] space-y-10">
          
          
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
              <LinkIcon className="h-5 w-5 text-zinc-100" />
            </div>
            <h1 className="text-xl font-medium tracking-tight text-zinc-100 italic">Swarve.</h1>
          </div>

          <div className="space-y-6">
            
            <button
              onClick={() => validateAccess(() => signIn("discord", { callbackUrl: "/dashboard" }))}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-zinc-800 bg-transparent text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-900 hover:text-zinc-100 active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 -28.5 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fillRule="nonzero" />
              </svg>
              Continue with Discord
            </button>

            

            
          </div>

          
          <div className="flex flex-col items-center">
            <label className="group flex cursor-pointer items-center gap-3">
              <div className="relative flex h-5 w-5 items-center justify-center">
                <input
                  type="checkbox"
                  className="peer hidden"
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <motion.div 
                  initial={false}
                  animate={{ 
                    backgroundColor: accepted ? "#5865F2" : "rgba(0,0,0,0)",
                    borderColor: accepted ? "#5865F2" : "#27272a" 
                  }}
                  className="h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors duration-200"
                >
                  <AnimatePresence>
                    {accepted && (
                      <motion.svg
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              <span className={`text-[11px] font-medium transition-colors ${accepted ? "text-zinc-400" : "text-zinc-600"}`}>
                I agree to the <Link href="/terms" className="underline underline-offset-4 decoration-zinc-800 hover:text-zinc-300">Terms</Link> & <Link href="/privacy" className="underline underline-offset-4 decoration-zinc-800 hover:text-zinc-300">Privacy</Link>
              </span>
            </label>
          </div>
        </div>
      </main>

    </div>
  );
}