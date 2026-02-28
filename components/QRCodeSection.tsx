"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, CheckCircle2, Loader2 } from "lucide-react";

export default function QRCodeSection({ slug }: { slug: string, destinationUrl: string }) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setQrValue(`${window.location.origin}/${slug}`);
  }, [slug]);

  const downloadQR = () => {
    setIsDownloading(true);
    const svg = document.getElementById("qr-code-svg") as SVGElement | null;
    if (!svg) {
      setIsDownloading(false);
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20, 360, 360);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-swarve-${slug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      setIsDownloading(false);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl h-fit shadow-lg">
      <h3 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider flex items-center gap-2">
        <QrCode size={16} className="text-zinc-500" />
        QR Generator
      </h3>

      {!isGenerated ? (
        <div className="space-y-4">
          <p className="text-xs text-zinc-500 leading-relaxed">
            Generate a dynamic QR code. If you change the destination URL later, this QR will still work.
          </p>
          <button
            onClick={() => setIsGenerated(true)}
            className="w-full bg-white text-black text-sm font-bold py-2.5 rounded-xl hover:bg-zinc-200 transition-all shadow-md"
          >
            Generate QR Code
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white p-4 rounded-xl flex justify-center border-4 border-zinc-800/10">
            {qrValue && (
              <QRCodeSVG
                id="qr-code-svg"
                value={qrValue}
                size={160}
                level={"H"}
                includeMargin={false}
              />
            )}
          </div>
          
          <button
            onClick={downloadQR}
            disabled={isDownloading}
            className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Download PNG
          </button>

          <div className="flex items-center gap-2 text-[10px] text-zinc-500 bg-zinc-900/50 p-2 rounded-md border border-zinc-800/50">
            <CheckCircle2 size={12} className="text-green-500" />
            <span className="truncate max-w-[180px]">{qrValue}</span>
          </div>
        </div>
      )}
    </div>
  );
}