"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Scale, ShieldCheck, Lock, AlertCircle } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Acceptance of Terms",
      content: "By accessing Swarve Links, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use our service."
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "User Conduct",
      content: "You agree not to use Swarve Links for any illegal activities, including but not limited to spreading malware, phishing, or sharing prohibited content. We reserve the right to ban any link without notice."
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Privacy & Data",
      content: "Your privacy is paramount. We collect minimal data necessary for link redirection and analytics. Check our Privacy Policy for more details on how we handle your info."
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: "Limitation of Liability",
      content: "Swarve Links is provided 'as is'. We are not responsible for any damages resulting from the use or inability to use our URL shortening service."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="relative flex-grow py-24 px-6">
        
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Terms of <span className="text-neutral-500">Service</span>
            </h1>
            <p className="text-neutral-400">Last updated: January 27, 2026</p>
          </div>

          
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="group border-l border-white/10 pl-6 hover:border-white/40 transition-colors">
                <div className="flex items-center gap-3 mb-3 text-neutral-200">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">{section.title}</h2>
                </div>
                <p className="text-neutral-400 leading-relaxed max-w-2xl text-sm md:text-base">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          
          <div className="mt-20 p-8 rounded-3xl bg-neutral-900/30 border border-white/5 text-center">
            <p className="text-neutral-500 text-sm">
              Have questions about our terms? <br className="md:hidden" />
              <a href="mailto:stoxerastudios@gmail.com" className="text-white hover:underline underline-offset-4">Contact our legal team</a>
            </p>
          </div>
        </div>
      </main>

      
    </div>
  );
}