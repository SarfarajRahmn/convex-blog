"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

gsap.registerPlugin(ScrollTrigger);

export function NewsletterSection() {
  const container = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");

  useGSAP(
    () => {
      gsap.fromTo(
        ".newsletter-panel",
        { y: 50, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".newsletter-panel", start: "top 88%" },
        },
      );
    },
    { scope: container },
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("You're subscribed! 🎉");
    setEmail("");
  }

  return (
    <section ref={container} className="px-4 py-16">
      <div className="newsletter-panel glass-strong glass-sheen relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] px-6 py-14 text-center opacity-0 sm:px-12">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="glass h-12 rounded-full border-0 px-5 text-base"
          />
          <button
            type="submit"
            className="btn-glow inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            Subscribe
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
