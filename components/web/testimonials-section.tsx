"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

gsap.registerPlugin(ScrollTrigger);

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
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".testimonial-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".testimonial-header", start: "top 85%" },
        },
      );

      gsap.fromTo(
        ".testimonial-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: { trigger: ".testimonials-grid", start: "top 85%" },
        },
      );
    },
    { scope: container },
  );

  return (
    <section ref={container} className="px-4 py-20">
      <div className="mx-auto max-w-6xl space-y-14">
        <div className="testimonial-header mx-auto max-w-2xl space-y-4 text-center opacity-0">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Loved by builders
          </h2>
          <p className="text-lg text-muted-foreground">
            Developers ship faster and sleep better with a stack that handles
            the hard parts for them.
          </p>
        </div>

        <div className="testimonials-grid grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="testimonial-card glass glass-sheen flex flex-col rounded-2xl p-7 opacity-0"
            >
              <div className="mb-4 flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar className="size-10">
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
          ))}
        </div>
      </div>
    </section>
  );
}
