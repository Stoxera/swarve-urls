
"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";

export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      disabled={pending}
      className={`cursor-pointer p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all
        ${pending ? "animation-loading-1" : ""}`}
    >
      <Trash2 size={16} className={pending ? "opacity-20" : ""} />
    </button>
  );
}