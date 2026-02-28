"use client"

import React, { useState } from 'react';
import { ArrowLeft, Bug, Send, CheckCircle2, Terminal, Info, Mail } from 'lucide-react';
import Link from 'next/link';

const useBugReport = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendReport = async (data: { 
    title: string; 
    severity: string; 
    area: string; 
    description: string;
    email: string; 
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert("Failed to send report. Please try again.");
      }
    } catch (error) {
      console.error("Error reporting bug:", error);
      alert("A connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { sendReport, loading, success };
};

export default function BugReportPage() {
  const { sendReport, loading, success } = useBugReport();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await sendReport({
      title: formData.get('title') as string,
      severity: formData.get('severity') as string,
      area: formData.get('area') as string,
      description: formData.get('description') as string,
      email: formData.get('email') as string,
    });
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-3xl max-w-md text-center shadow-2xl">
          <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Bug Reported</h2>
          <p className="text-zinc-500 text-sm mb-8">
            Thanks for helping us improve Swarve. We've sent a confirmation email to your inbox and notified our devs via Discord.
          </p>
          <Link 
            href="/dashboard" 
            className="block w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-white selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-zinc-900 p-2 rounded-lg">
              <Bug size={20} className="text-zinc-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Report a Bug</h1>
          </div>
          <p className="text-zinc-500 text-sm">Found a glitch in the matrix? Our team will squash it.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email del reportero */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                  <Mail size={10} /> Your Email Address
                </label>
                <input 
                  required
                  name="email"
                  type="email" 
                  placeholder="contact@example.com"
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Issue Headline</label>
                <input 
                  required
                  name="title"
                  type="text" 
                  placeholder="e.g. Analytics chart not loading on mobile"
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Severity</label>
                  <select name="severity" className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-sm focus:outline-none focus:border-white appearance-none transition-colors cursor-pointer text-zinc-300">
                    <option value="Low">Low - Minor UI glitch</option>
                    <option value="Medium">Medium - Functionality issue</option>
                    <option value="High">High - Critical crash</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Area</label>
                  <select name="area" className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-sm focus:outline-none focus:border-white appearance-none transition-colors cursor-pointer text-zinc-300">
                    <option value="Dashboard">Dashboard</option>
                    <option value="Analytics">Analytics</option>
                    <option value="QR Generator">QR Generator</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Detailed Description</label>
                <textarea 
                  required
                  name="description"
                  rows={5}
                  placeholder="What happened? How can we reproduce it?"
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700 resize-none text-zinc-300"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Transmitting to HQ..." : (
                  <>
                    Submit Report <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-zinc-400">
                <Terminal size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Environment</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-600 uppercase">Platform</span>
                  <span className="text-zinc-400">Web App</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-600 uppercase">Node Engine</span>
                  <span className="text-zinc-400 font-mono">Edge v20</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-600 uppercase">Channel</span>
                  <span className="text-zinc-400">Public Beta</span>
                </div>
              </div>
            </div>

            <div className="p-6 border border-zinc-900 rounded-2xl bg-zinc-900/10 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-zinc-600 shrink-0" />
                <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                  By submitting this form, you agree to share technical context of the current session. No private passwords or keys are ever sent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}