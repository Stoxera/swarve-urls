"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Eye, Database, Cookie, Mail } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Data Collection",
      content: "We collect minimal information when you create or visit a link. This includes IP addresses (for security and geo-analytics), browser types, and referral URLs to provide statistics to our users."
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "How We Use Data",
      content: "The data collected is used solely to provide analytics, prevent fraud, and ensure the stability of our redirection service. We never sell your personal data to third parties."
    },
    {
      icon: <Cookie className="w-5 h-5" />,
      title: "Cookies",
      content: "Swarve Links uses essential cookies to manage user sessions and remember your preferences. You can disable cookies in your browser settings, but some features may not function correctly."
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Your Rights",
      content: "You have the right to request the deletion of your account and all associated data. Contact us if you wish to exercise your data protection rights under GDPR or CCPA."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="relative flex-grow py-24 px-6">
        
        <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Privacy <span className="text-neutral-500">Policy</span>
            </h1>
            <p className="text-neutral-400">Effective Date: January 27, 2026</p>
          </div>

          
          <div className="grid gap-12">
            {sections.map((section, index) => (
              <section key={index} className="group flex flex-col md:flex-row gap-6 border-b border-white/5 pb-12 last:border-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300">
                    {section.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-3 text-neutral-100 italic">
                    {section.title}
                  </h2>
                  <p className="text-neutral-400 leading-relaxed text-sm md:text-base max-w-2xl">
                    {section.content}
                  </p>
                </div>
              </section>
            ))}
          </div>

          
          <div className="mt-20 p-1 bg-gradient-to-r from-transparent via-white/10 to-transparent">
            <div className="bg-black p-8 text-center">
              <p className="text-neutral-400 text-sm mb-4">
                Questions about your data? We're here to help.
              </p>
              <a 
                href="mailto:stoxerastudios@gmail.com" 
                className="inline-block px-6 py-2 border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white hover:text-black transition-all"
              >
                stoxerastudios@gmail.com
              </a>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}