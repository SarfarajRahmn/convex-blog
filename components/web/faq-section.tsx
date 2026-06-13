"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Is this template really free and open source?",
    a: "Yes. Everything you see — the real-time backend, auth, and the glassy UI — is open source and free to use in personal and commercial projects.",
  },
  {
    q: "Do I need to manage a database?",
    a: "No. Convex provides a reactive, serverless database with live queries out of the box. You write functions, it handles syncing, scaling, and caching.",
  },
  {
    q: "How does authentication work?",
    a: "Better Auth handles secure email/password (and more) and integrates directly with Convex, so your queries and mutations are authenticated end-to-end.",
  },
  {
    q: "Can I deploy this to production?",
    a: "Absolutely. It builds as a standard Next.js 16 app and deploys to Vercel (or any Node host) with your Convex deployment connected via environment variables.",
  },
  {
    q: "Is it mobile friendly?",
    a: "Every section is fully responsive with a mobile drawer nav, fluid typography, safe-area-aware controls, and touch-friendly tap targets.",
  },
];

export function FaqSection() {
  const container = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(
    () => {
      gsap.fromTo(
        ".faq-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".faq-header", start: "top 85%" },
        },
      );

      gsap.fromTo(
        ".faq-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".faq-list", start: "top 85%" },
        },
      );
    },
    { scope: container },
  );

  return (
    <section ref={container} className="px-4 py-20">
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="faq-header mx-auto max-w-2xl space-y-4 text-center opacity-0">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know before you start building.
          </p>
        </div>

        <div className="faq-list space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="faq-item glass overflow-hidden rounded-2xl opacity-0"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold sm:text-lg">
                    {faq.q}
                  </span>
                  <Plus
                    className={cn(
                      "size-5 shrink-0 text-primary transition-transform duration-300",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
