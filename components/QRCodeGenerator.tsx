"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, Loader2 } from "lucide-react";

export default function QRCodeCard({ slug }: { slug: string }) {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    setGenerated(true);
    setLoading(false);
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-gen");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${slug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const qrUrl = `${window.location.origin}/${slug}`;

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl h-fit shadow-xl">
      <h3 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider flex items-center gap-2">
        <QrCode size={16} className="text-zinc-500" />
        QR Engine
      </h3>

      {!generated ? (
        <div className="text-center py-4">
          <p className="text-xs text-zinc-500 mb-4">
            Create a high-resolution dynamic QR code for this link.
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-white text-black text-sm font-bold py-2 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Generate QR Code"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-xl flex justify-center">
            <QRCodeSVG
              id="qr-gen"
              value={qrUrl}
              size={160}
              level={"H"}
              includeMargin={false}
            />
          </div>
          <button
            onClick={downloadQR}
            className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs font-medium py-2 rounded-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            <Download size={14} /> Download PNG
          </button>
          <p className="text-[10px] text-zinc-600 text-center italic">
            Redirects to: {qrUrl}
          </p>
        </div>
      )}
    </div>
  );
}