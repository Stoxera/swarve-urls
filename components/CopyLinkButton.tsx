"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullUrl = `https://swarve.link/${slug}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="cursor-pointer p-2 text-zinc-500 hover:text-orange-400 hover:bg-orange-400/10 rounded-md transition-all group relative"
      title="Copy Link"
    >
      {copied ? (
        <Check size={16} className="text-orange-400" />
      ) : (
        <Copy size={16} />
      )}
      
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-400 text-black text-[10px] font-bold px-2 py-1 rounded">
          COPIED!
        </span>
      )}
    </button>
  );
}