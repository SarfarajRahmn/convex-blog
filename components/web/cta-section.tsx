"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-panel",
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cta-panel", start: "top 88%" },
        },
      );
    },
    { scope: container },
  );

  return (
    <section ref={container} className="px-4 pb-28 pt-10">
      <div className="cta-panel glass-strong glass-sheen relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] px-6 py-16 text-center opacity-0 sm:px-12 sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">
          Ready to build something{" "}
          <span className="text-aurora">unforgettable?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Spin up your real-time, authenticated blog in minutes. No boilerplate,
          no config hell — just ship.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Uiverse-style animated glow button */}
          <Link
            href="/create"
            className="btn-glow group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-base font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            Start Writing
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/blog"
            className="glass glass-sheen inline-flex h-14 items-center justify-center rounded-full px-8 text-base font-semibold transition-transform hover:-translate-y-0.5"
          >
            Explore the Blog
          </Link>
        </div>
      </div>
    </section>
  );
}
