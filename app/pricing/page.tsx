"use client";
import { Check } from "lucide-react";
import Header from "@/components/Header";
import { toast, Toaster } from "sonner"; 

const tiers = [
  {
    name: "Starter",
    price: "$0",
    description: "Essential for personal projects and social sharing.",
    features: ["50 Active links", "Basic click tracking", "Swarve branded links", "Standard support"],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    description: "Advanced tools for power users and creators.",
    features: ["Unlimited links", "Geo-location analytics", "Custom domains", "Remove Swarve branding", "Priority 24/7 support"],
    button: "Go Pro Now",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full control and scalability for large teams.",
    features: ["Full API access", "Team workspaces", "Dedicated account manager", "SLA guarantee", "White-label solution"],
    button: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  
  
  const handlePurchase = () => {
    toast.success("Everything is currently free without limits!", {
      description: "Take advantage of this opportunity!",
      duration: 5000,
      style: {
        background: "#000",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.1)",
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      <Toaster position="bottom-right" theme="dark" />
      
      <Header />

      <main className="relative flex-grow py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-500 mb-4 italic">
              Special Launch Offer
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Simple Pricing, <br className="hidden md:block" /> No Hidden Fees.
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the plan that fits your needs. Scale your links as you grow your audience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative group rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 border ${
                  tier.popular 
                    ? "border-white/20 bg-neutral-900/30 shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]" 
                    : "border-white/5 bg-neutral-950/50 hover:border-white/10"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-xl">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-medium text-gray-200 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-gray-500 text-sm">/mo</span>}
                  </div>
                  <p className="mt-4 text-sm text-gray-500 italic opacity-80">
                    "{tier.description}"
                  </p>
                </div>

                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handlePurchase} 
                  className={`cursor-pointer w-full py-4 rounded-xl font-bold transition-all duration-300 transform active:scale-95 ${
                    tier.popular
                      ? "bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/5"
                      : "bg-neutral-900 text-white border border-white/10 hover:bg-white hover:text-black"
                  }`}
                >
                  {tier.button}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center gap-4">
            <p className="text-gray-600 text-sm italic">
              * For a limited time, all premium features are unlocked.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}