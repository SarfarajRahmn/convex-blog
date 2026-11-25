"use client";

import { useRef, useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { Loader2, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Cube3D } from "./fx/Cube3D";
import { useScrollReveal } from "./fx/use-scroll-reveal";

export function NewsletterSection() {
  const container = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const subscribe = useMutation(api.newsletter.subscribe);
  useScrollReveal(container);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      toast.error("Please enter a valid email");
      return;
    }

    startTransition(async () => {
      try {
        await subscribe({ email: address });
        toast.success("You're subscribed! 🎉");
        setEmail("");
      } catch {
        // Keep what was typed so the visitor can try again.
        toast.error("Couldn't subscribe you. Please try again.");
      }
    });
  }

  return (
    <section ref={container} className="py-16">
      <div
        data-reveal
        className="surface relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12"
      >
        <Cube3D className="absolute left-[7%] top-10 hidden md:block [--cube:48px]" />
        <Cube3D className="absolute bottom-12 right-[8%] hidden md:block [animation-delay:-3.5s] [--cube:34px]" />
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Mail className="size-7" />
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Never miss a <span className="text-aurora">drop</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Get new articles and videos delivered to your inbox. No spam, just the
          good stuff — unsubscribe anytime.
        </p>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            name="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="h-12 rounded-full bg-background/60 px-5 text-base"
          />
          <button
            type="submit"
            disabled={isPending}
            className="btn-glow group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 font-semibold hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
          >
            {isPending ? (
              <>
                Subscribing…
                <Loader2 className="size-4 animate-spin" />
              </>
            ) : (
              <>
                Subscribe
                <Send className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
