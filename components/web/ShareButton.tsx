"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  text?: string;
}

/**
 * Share the current page using the native Web Share API on supported
 * (mostly mobile) devices, falling back to copying the URL to the clipboard.
 */
export function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: text ?? title, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      <span>Share</span>
    </Button>
  );
}
