"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Shuffle, Rocket, Tags, Save, ShieldAlert } from "lucide-react";
import { createShortUrl, updateLink } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

interface CreateLinkModalProps {
  children: React.ReactNode;
  disabled?: boolean;
  initialData?: {
    id: string;
    url: string;
    slug: string;
    description?: string;
  };
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`cursor-pointer flex items-center gap-2 bg-zinc-100 text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
        pending ? "animate-pulse" : ""
      }`}
    >
      {pending ? (
        <span className="italic">Scanning & Saving...</span>
      ) : (
        <>
          {isEditing ? <Save size={16} /> : <Rocket size={16} />}
          {isEditing ? "Save Changes" : "Create"}
        </>
      )}
    </button>
  );
}

export default function CreateLinkModal({
  children,
  disabled,
  initialData,
}: CreateLinkModalProps) {
  const [open, setOpen] = React.useState(false);
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const isEditing = !!initialData;

  const generateRandomSlug = () => {
    if (isEditing) return;
    setSlug(Math.random().toString(36).substring(2, 8));
  };

  async function handleSubmit(formData: FormData) {
    const result = isEditing 
      ? await updateLink(formData) 
      : await createShortUrl(formData);

    if (result?.success) {
      toast.success(isEditing ? "Link updated!" : "Link created!");
      setOpen(false);
      if (!isEditing) setSlug("");
    } else {
      if (result?.error === "Security Alert") {
        toast.error("URL Blocked", {
          description: "Dymo detected a phishing or malware threat.",
          icon: <ShieldAlert className="text-red-500" />,
        });
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    }
  }

  if (disabled && !isEditing) return <>{children}</>;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-[#0F0F0F] border border-zinc-800 p-6 rounded-2xl shadow-2xl z-[101] outline-none">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-zinc-100 italic">
              {isEditing ? "Edit link" : "Create new link"}
            </Dialog.Title>
            <Dialog.Close className="cursor-pointer text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </Dialog.Close>
          </div>

          <form action={handleSubmit} className="space-y-5">
            {isEditing && <input type="hidden" name="id" value={initialData.id} />}

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-200">Destination URL:</label>
              <input
                name="url"
                type="url"
                required
                defaultValue={initialData?.url}
                placeholder="https://"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:border-zinc-600 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-200">Short link:</label>
              <div className="flex gap-2">
                <input
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="mylink"
                  readOnly={isEditing}
                  className={`flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 outline-none transition-all ${
                    isEditing ? "opacity-50 cursor-not-allowed" : "focus:border-zinc-600"
                  }`}
                />
                {!isEditing && (
                  <button
                    type="button"
                    onClick={generateRandomSlug}
                    className="cursor-pointer flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-lg text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition-all"
                  >
                    <Shuffle size={14} /> Randomize
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-200">Description (optional):</label>
              <textarea
                name="description"
                defaultValue={initialData?.description}
                placeholder="Enter a description"
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:border-zinc-600 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-4 mt-8 pt-4">
              <Dialog.Close className="cursor-pointer text-sm font-medium text-zinc-500 hover:text-white transition-colors">
                Cancel
              </Dialog.Close>
              <SubmitButton isEditing={isEditing} />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}