"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteLink } from "@/app/actions";
import { toast } from "sonner";

export default function DeleteLinkButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsPending(true);
    const formData = new FormData();
    formData.append("id", id);

    const result = await deleteLink(formData);

    if (result?.success) {
      toast.success("Link deleted successfully");
      setShowConfirm(false);
    } else {
      toast.error("Failed to delete link");
    }
    setIsPending(false);
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
      >
        <Trash2 size={16} />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A0A] border border-zinc-900 p-6 rounded-xl max-w-sm w-full shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Are you sure?</h3>
            <p className="text-zinc-400 text-sm mb-6">
              This action cannot be undone. This will permanently delete your short link.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                Delete Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}