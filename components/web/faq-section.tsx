"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./fx/SectionHeading";
import { useScrollReveal } from "./fx/use-scroll-reveal";

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
  const container = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  useScrollReveal(container);

  return (
    <section ref={container} className="py-24">
      <div className="mx-auto max-w-3xl space-y-14">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions,"
          accent="answered"
          description="Everything you need to know before you start building."
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} data-reveal data-reveal-delay={i * 0.06}>
                <div
                  className={cn(
                    "surface overflow-hidden rounded-2xl transition-colors duration-300 hover:border-primary/40",
                    isOpen && "border-primary/50",
                  )}
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
