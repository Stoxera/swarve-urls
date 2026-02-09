import React from 'react';
import { Metadata } from 'next';
import { BarChart3, Globe, MousePointerClick, QrCode, ShieldCheck, Construction, Timer, Hammer } from 'lucide-react';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Analytics: ${slug} | Swarve` };
}

export default async function AnalyticsPage({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Analytics for /{slug}
          </h1>
          <p className="text-zinc-500 mt-1">Monitor performance and click origins in real-time.</p>
        </div>
        <div className="flex gap-3 opacity-30 cursor-not-allowed">
          <button disabled className="flex items-center gap-2 bg-transparent px-4 py-2 rounded-lg border border-zinc-800 text-zinc-500">
            <QrCode size={18} />
            Download QR
          </button>
        </div>
      </div>

      {/* Main Content Area with Development Overlay */}
      <div className="relative">
        {/* Under Development Overlay */}
        <div className="absolute inset-0 z-20 backdrop-blur-sm bg-black/40 flex items-center justify-center rounded-2xl border border-zinc-900">
          <div className="bg-black border border-zinc-800 p-8 rounded-2xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] max-w-md text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700">
              <Construction className="text-white animate-pulse" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3 tracking-tight">Feature Under Development</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              We are currently building a high-precision analytics engine for <span className="text-white font-mono">Swarve</span>. Detailed visitor insights will be available soon.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-medium uppercase tracking-widest text-zinc-600">
              <span className="flex items-center gap-1"><Timer size={14}/> Coming Soon</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full" />
              <span className="flex items-center gap-1"><Hammer size={14}/> V1.2.0</span>
            </div>
          </div>
        </div>

        {/* Blurred Background Content (B&W) */}
        <div className="opacity-10 pointer-events-none select-none grayscale">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total Clicks', value: '0,000', icon: MousePointerClick },
              { label: 'QR Scans', value: '000', icon: QrCode },
              { label: 'Locations', value: '0 countries', icon: Globe },
            ].map((stat, i) => (
              <div key={i} className="bg-transparent border border-zinc-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="text-white" size={24} />
                  <span className="text-xs font-medium text-zinc-700 uppercase tracking-wider">Live</span>
                </div>
                <p className="text-zinc-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Activity Log Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-transparent border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="text-white" size={20} />
                  Activity Log (IP Logger)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase text-zinc-600 bg-zinc-900/50">
                      <th className="px-6 py-4 font-medium">IP Address</th>
                      <th className="px-6 py-4 font-medium">Location</th>
                      <th className="px-6 py-4 font-medium">Device</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    <tr>
                      <td className="px-6 py-4 font-mono text-sm">000.000.0.00</td>
                      <td className="px-6 py-4 text-sm">London, UK</td>
                      <td className="px-6 py-4 text-sm">Safari / iOS</td>
                      <td className="px-6 py-4 text-sm">1 min ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Tip */}
            <div className="space-y-6">
              <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
                <h3 className="font-semibold mb-2 text-white text-sm uppercase tracking-wider">Swarve Tip</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  You are using **Dynamic QR**. You can change the destination URL and the printed code will remain the same.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}