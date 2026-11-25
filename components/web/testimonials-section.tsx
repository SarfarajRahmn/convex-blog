"use client";

import { useRef } from "react";
import { Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TiltCard } from "./fx/TiltCard";
import { SectionHeading } from "./fx/SectionHeading";
import { useScrollReveal } from "./fx/use-scroll-reveal";

const testimonials = [
  {
    name: "Ava Thompson",
    role: "Frontend Lead",
    quote:
      "The real-time sync is witchcraft. I shipped a collaborative editor in an afternoon and never touched a websocket.",
  },
  {
    name: "Marcus Lee",
    role: "Indie Hacker",
    quote:
      "This is the cleanest Next.js + Convex setup I've used. The glassy UI alone made my users think we raised a Series A.",
  },
  {
    name: "Priya Nair",
    role: "Staff Engineer",
    quote:
      "Auth, database, and caching just worked together out of the box. The developer velocity here is genuinely unfair.",
  },
];

export function TestimonialsSection() {
  const container = useRef<HTMLElement>(null);
  useScrollReveal(container);

  return (
    <section ref={container} className="py-24">
      <div className="mx-auto max-w-6xl space-y-16">
        <SectionHeading
          eyebrow="Community"
          title="Loved by"
          accent="builders"
          description="Developers ship faster and sleep better with a stack that handles the hard parts for them."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              data-reveal
              data-reveal-delay={i * 0.12}
              className={i === 1 ? "md:translate-y-8" : undefined}
            >
              <TiltCard
                className="h-full"
                innerClassName="rounded-3xl"
                max={12}
              >
                <figure className="flex h-full flex-col p-8 [transform-style:preserve-3d]">
                  <Quote className="depth-lg absolute right-6 top-6 size-10 text-primary/25" />
                  <div className="mb-5 flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} className="size-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="depth-sm flex-1 text-base leading-relaxed text-foreground/90">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="depth-sm mt-7 flex items-center gap-3">
                    <Avatar className="size-11 ring-2 ring-primary/30">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${t.name}`}
                        alt={t.name}
                      />
                      <AvatarFallback>
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
