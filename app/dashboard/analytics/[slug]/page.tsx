import React from 'react';
import { Metadata } from 'next';
import { Globe, MousePointerClick, ShieldCheck, MapPin, ArrowLeft, BarChart3, ExternalLink } from 'lucide-react';
import { turso } from '@/lib/turso';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import QRCodeSection from '@/components/QRCodeSection';

type Params = Promise<{ slug: string }>;

interface ClickRow {
  ip: string | null;
  country: string | null;
  city: string | null;
  userAgent: string | null;
  createdAt: string | null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Analytics: /${slug} | Swarve` };
}

export default async function AnalyticsPage({ params }: { params: Params }) {
  const { slug } = await params;

  const linkData = await turso.execute({
    sql: "SELECT id, url, clicks FROM links WHERE slug = ? LIMIT 1",
    args: [slug]
  });

  if (!linkData.rows || linkData.rows.length === 0) notFound();
  
  const firstRow = linkData.rows[0];
  const linkId = firstRow?.id ? String(firstRow.id) : "";
  const totalClicks = firstRow?.clicks ? Number(firstRow.clicks) : 0;
  const destinationUrl = firstRow?.url ? String(firstRow.url) : "";

  if (!linkId) notFound();

  // Get chart data
  const chartResult = await turso.execute({
    sql: `SELECT date(createdAt) as day, COUNT(*) as count FROM clicks_log WHERE linkId = ? AND createdAt >= date('now', '-7 days') GROUP BY day ORDER BY day ASC`,
    args: [linkId]
  });
  const chartData = chartResult.rows.map(row => ({ day: String(row.day), count: Number(row.count) }));
  const maxClicks = Math.max(...chartData.map(d => d.count), 1);

  // Get Top Countries
  const topCountries = await turso.execute({
    sql: "SELECT country, COUNT(*) as count FROM clicks_log WHERE linkId = ? GROUP BY country ORDER BY count DESC LIMIT 5",
    args: [linkId]
  });

  // Get Recent Clicks
  const clicksLog = await turso.execute({
    sql: `SELECT ip, country, city, userAgent, createdAt FROM clicks_log WHERE linkId = ? ORDER BY createdAt DESC LIMIT 20`,
    args: [linkId]
  });

  const stats = [
    { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: MousePointerClick },
    { label: 'Top Region', value: String(topCountries.rows[0]?.country ?? 'N/A'), icon: Globe },
    { label: 'Status', value: 'Active', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Analytics <span className="text-zinc-500 font-mono text-2xl">/{slug}</span>
            </h1>
            <p className="text-zinc-500 mt-1 flex items-center gap-2 text-sm">
              Tracking <span className="text-zinc-300 underline decoration-zinc-700 underline-offset-4">{destinationUrl}</span>
              <ExternalLink size={12}/>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
                  <stat.icon size={20} />
                </div>
                <div className={`h-2 w-2 rounded-full ${totalClicks > 0 ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`} />
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold mt-1 tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* Main Chart Section */}
          <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-10">
              <BarChart3 size={16} className="text-zinc-500" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Activity (Last 7 Days)</h2>
            </div>
            
            <div className="flex items-end justify-between h-48 gap-3 relative">
              {totalClicks === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/10 rounded-xl border border-dashed border-zinc-900">
                  <BarChart3 size={32} className="mb-2 opacity-20" />
                  <p className="text-xs font-medium">No activity recorded in the last 7 days</p>
                </div>
              ) : (
                chartData.map((day, i) => {
                  const height = (day.count / maxClicks) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10">
                        {day.count} clicks
                      </div>
                      <div 
                        className="w-full max-w-[40px] bg-zinc-900 group-hover:bg-white transition-all rounded-t-md"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                      <span className="text-[10px] text-zinc-600 font-mono uppercase">
                        {new Date(day.day).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Countries Section */}
          <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-8 text-zinc-500">
              <Globe size={16} />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Top Countries</h2>
            </div>
            <div className="space-y-6">
              {topCountries.rows.length === 0 ? (
                <div className="py-10 text-center">
                  <Globe size={24} className="mx-auto mb-2 text-zinc-800" />
                  <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Waiting for data...</p>
                </div>
              ) : (
                topCountries.rows.map((row, i) => {
                  const percentage = totalClicks > 0 ? (Number(row.count) / totalClicks) * 100 : 0;
                  const countryName = String(row.country || 'Unknown');
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-zinc-300">{countryName}</span>
                        <span className="text-zinc-500">{Number(row.count)}</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-zinc-400 rounded-full transition-all duration-1000" 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Visitors Table */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-900 bg-zinc-950/50">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                Recent Visitors
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase text-zinc-600 bg-zinc-900/30">
                    <th className="px-6 py-4 font-bold">IP Address</th>
                    <th className="px-6 py-4 font-bold">Location</th>
                    <th className="px-6 py-4 font-bold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {clicksLog.rows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-20 text-center text-zinc-600 text-xs italic">
                        No visitors detected for this link yet.
                      </td>
                    </tr>
                  ) : (
                    (clicksLog.rows as unknown as ClickRow[]).map((click, idx) => {
                      const date = click?.createdAt ? new Date(click.createdAt) : new Date();
                      return (
                        <tr key={idx} className="hover:bg-zinc-900/20 transition-colors group">
                          <td className="px-6 py-4 font-mono text-xs text-zinc-400 group-hover:text-white transition-colors">
                            {click?.ip ?? '0.0.0.0'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin size={12} className="text-zinc-600" />
                              <div className="flex flex-col">
                                <span className="text-zinc-300">{click?.city ?? 'Unknown'}</span>
                                <span className="text-[10px] text-zinc-600 uppercase font-bold">{click?.country ?? 'XX'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs text-zinc-500 tabular-nums">{date.toLocaleDateString()}</span>
                            <span className="block text-[10px] text-zinc-700 tabular-nums">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-6">
            <QRCodeSection slug={slug} destinationUrl={destinationUrl} />
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-4 tracking-[0.2em]">Quick Meta</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-zinc-600 uppercase">Redirection</span>
                   <span className="text-[10px] text-zinc-400 font-mono">301 Permanent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}