"use client";

import { getLinksForExport, setup2FA, verifyAndEnable2FA } from "@/app/actions";
import { Download, Shield, Smartphone, X, Loader2, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isExporting, setIsExporting] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; qr: string } | null>(null);

  // Verificamos si el método de login es con Email/Contraseña
  // En Auth.js, esto se suele ver en account.provider o session.user.method
  // Aquí asumimos que si el provider es 'discord', bloqueamos la 2FA
  // Forzamos a TS a tratar la sesión como 'any' para saltar la validación 
  // solo en estas líneas, o mejor aún, usa una aserción de tipo:
  const sessionData = session as any;

  const isEmailUser = session?.user?.email && sessionData?.provider === "credentials";
  const isDiscordUser = sessionData?.provider === "discord";

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

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `swarve-links-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleStart2FA = async () => {
    setIsLoading(true);
    try {
      const data = await setup2FA();
      setSetupData({ secret: data.secret, qr: data.qrImageData });
      setShow2FA(true);
    } catch (error) {
      alert("Error generating 2FA setup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!setupData || verificationCode.length !== 6) return;
    setIsLoading(true);
    try {
      const result = await verifyAndEnable2FA(verificationCode, setupData.secret);
      if (result.success) {
        setIs2FAEnabled(true);
        setShow2FA(false);
        setSetupData(null);
        setVerificationCode("");
      } else {
        alert(result.error || "Invalid code.");
      }
    } catch (error) {
      alert("Verification error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10 font-sans">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight italic">Settings</h1>
        <p className="text-zinc-500 text-sm mt-2">Manage your account and security preferences.</p>
      </div>

      <div className="grid gap-6">
        
        {/* Sección de 2FA Condicional */}
        {isDiscordUser ? (
            /* Mostrar información de por qué no está disponible */
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 flex items-center justify-between opacity-60">
                <div className="flex gap-4">
                    <div className="p-2 bg-zinc-900 rounded-lg h-fit">
                        <Lock size={20} className="text-zinc-500" />
                    </div>
                    <div>
                        <h3 className="text-zinc-300 font-medium">Two-Factor Authentication</h3>
                        <p className="text-zinc-600 text-sm max-w-sm mt-1">
                            Managed by Discord. You can enable 2FA directly in your Discord account settings.
                        </p>
                    </div>
                </div>
                <span className="text-[10px] border border-zinc-800 text-zinc-600 px-2 py-1 rounded-md font-bold uppercase">External</span>
            </div>
        ) : (
            /* Sección Normal para usuarios de Email/Pass */
            <div className={`bg-[#0A0A0A] border ${is2FAEnabled ? 'border-zinc-700' : 'border-zinc-900'} rounded-2xl p-6 transition-all`}>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="p-2 bg-zinc-900 rounded-lg h-fit">
                    <Smartphone size={20} className={is2FAEnabled ? "text-white" : "text-zinc-400"} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">Two-Factor Authentication (2FA)</h3>
                      {is2FAEnabled && <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold uppercase">Active</span>}
                    </div>
                    <p className="text-zinc-500 text-sm max-w-sm mt-1">
                      Add an extra layer of security using an authenticator app.
                    </p>
                  </div>
                </div>
                {!is2FAEnabled ? (
                  <button
                    onClick={handleStart2FA}
                    disabled={isLoading}
                    className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
                  >
                    {isLoading && !show2FA ? <Loader2 className="animate-spin" size={16} /> : "Enable 2FA"}
                  </button>
                ) : (
                  <button onClick={() => setIs2FAEnabled(false)} className="text-zinc-500 text-sm font-medium hover:text-white transition-all">
                    Disable
                  </button>
                )}
              </div>

              {show2FA && setupData && (
                <div className="mt-8 pt-8 border-t border-zinc-900">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="bg-white p-2 rounded-lg shrink-0">
                      <img src={setupData.qr} alt="QR" className="w-32 h-32" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium mb-4">Scan this QR or use the manual code in your app.</p>
                      <div className="flex gap-3">
                        <input 
                          type="text" maxLength={6} placeholder="000000"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white font-mono tracking-[0.5em] w-40 outline-none focus:border-white transition-all"
                        />
                        <button 
                          onClick={handleVerify2FA}
                          disabled={isLoading || verificationCode.length !== 6}
                          className="bg-white text-black px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                        >
                          Verify
                        </button>
                        <button onClick={() => setShow2FA(false)} className="p-2 text-zinc-500"><X size={20} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        )}

        {/* Export Data Section */}
        <div className="bg-[#0A0A0A] border border-zinc-900 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="p-2 bg-zinc-900 rounded-lg h-fit">
                <Download size={20} className="text-zinc-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Export Data</h3>
                <p className="text-zinc-500 text-sm max-w-sm mt-1">
                  Download your data in a plain text file.
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-zinc-900 text-white border border-zinc-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {isExporting ? "Exporting..." : "Export .TXT"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}