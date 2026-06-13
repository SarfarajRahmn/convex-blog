"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Glass badge
      tl.fromTo(
        ".hero-badge",
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5 },
        0,
      );

      // Glass panel
      tl.fromTo(
        ".hero-panel",
        { opacity: 0, scale: 0.96, filter: "blur(8px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8 },
        0.05,
      );

      // Title lines
      tl.fromTo(
        ".hero-title .line",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
        0.1,
      );

      // Subtitle
      tl.fromTo(
        ".hero-subtitle",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.35,
      );

      // CTA Buttons
      tl.fromTo(
        ".hero-cta",
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "back.out(1.7)",
        },
        0.5,
      );
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative flex-1 flex flex-col items-center justify-center min-h-[85vh] py-20 px-4 text-center overflow-hidden"
    >
      {/* Hero Content */}
      <div className="hero-panel glass-strong glass-sheen relative z-10 mx-auto max-w-4xl space-y-6 rounded-[2rem] px-6 py-12 opacity-0 sm:space-y-8 sm:px-12 sm:py-16">
        <span className="hero-badge glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium opacity-0">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Real-time. Reactive. Ridiculously fast.
        </span>

        <h1 className="hero-title text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl overflow-hidden flex flex-col gap-2">
          <span className="line block opacity-0">Ship products faster</span>
          <span className="line block text-aurora opacity-0">
            with Next.js & Convex
          </span>
        </h1>

        <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium opacity-0">
          A premium open-source template integrating the bleeding edge of the
          React ecosystem. Production ready, developer approved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 sm:gap-4 sm:pt-8">
          <Button
            asChild
            size="lg"
            className="hero-cta opacity-0 w-full sm:w-auto rounded-full px-8 h-14 text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-1"
          >
            <Link href="/blog">Start Reading</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="hero-cta glass glass-sheen opacity-0 w-full sm:w-auto rounded-full px-8 h-14 text-base border-0 hover:-translate-y-1 transition-all"
          >
            <Link href="/create">Write a Post</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
