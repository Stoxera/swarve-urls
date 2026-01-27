"use client";

import { getLinksForExport } from "@/app/actions";
import { Download, Shield, Bell, User, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const links = await getLinksForExport();
      
      if (links.length === 0) {
        alert("You don't have any links to export.");
        return;
      }

      
      let content = "--- SWARVE LINKS EXPORT ---\n\n";
      links.forEach((link: any) => {
        content += `Name (Slug): /${link.slug}\n`;
        content += `Destination: ${link.url}\n`;
        content += `Description: ${link.description || "No description"}\n`;
        content += `Clicks: ${link.clicks}\n`;
        content += `Created at: ${link.createdAt}\n`;
        content += `---------------------------\n\n`;
      });

      // Create and download the file
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `swarve-links-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Error exporting links.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight italic">Settings</h1>
        <p className="text-zinc-500 text-sm mt-2">Manage your account and personal data.</p>
      </div>

      <div className="grid gap-6">
        
        <div className="bg-[#0A0A0A] border border-zinc-900 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="p-2 bg-zinc-900 rounded-lg h-fit">
                <Download size={20} className="text-zinc-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Export Data</h3>
                <p className="text-zinc-500 text-sm max-w-sm mt-1">
                  Download all your shortened links, destinations, and statistics in a plain text file.
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {isExporting ? "Exporting..." : "Export all my links"}
            </button>
          </div>
        </div>

        
        <div className="bg-[#0A0A0A] border border-zinc-900 rounded-2xl p-6 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-zinc-900 rounded-lg">
              <Shield size={20} className="text-zinc-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Privacy & Security</h3>
              <p className="text-zinc-500 text-sm mt-1">Configure who can see your public statistics.</p>
            </div>
          </div>
        </div>

        {/* <div className="border border-red-900/30 bg-red-950/5 rounded-2xl p-6">
          <h3 className="text-red-400 font-medium">Danger Zone</h3>
          <p className="text-red-900/60 text-sm mt-1 mb-4">
            Once you delete your account, you will not be able to recover your links.
          </p>
          <button className="text-red-400 text-sm font-bold hover:underline">
            Delete my Swarve account
          </button>
        </div> */}
        
      </div>
    </main>
  );
}