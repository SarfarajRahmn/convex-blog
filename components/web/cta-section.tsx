"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "./fx/Magnetic";
import { MOTION_OK } from "./fx/use-scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

const orbits = [
  { size: 420, speed: 18, tiltX: 74, tiltY: -12 },
  { size: 620, speed: 28, tiltX: 70, tiltY: 14 },
  { size: 840, speed: 40, tiltX: 78, tiltY: -5 },
];

export function CtaSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          ".cta-panel",
          { rotateX: 22, scale: 0.88, y: 60, transformPerspective: 1300 },
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top 95%",
              end: "top 40%",
              scrub: 0.6,
            },
          },
        );
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} className="pb-28 pt-10">
      <div className="cta-panel surface relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] px-6 py-20 text-center sm:px-12 sm:py-28">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60%_90%_at_50%_115%,color-mix(in_oklch,var(--violet)_48%,transparent),transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-70 [mask-image:radial-gradient(48%_62%_at_50%_50%,transparent_55%,black_100%)]"
        >
          {orbits.map((orbit) => (
            <span
              key={orbit.size}
              className="orbit"
              style={
                {
                  "--size": `${orbit.size}px`,
                  "--speed": `${orbit.speed}s`,
                  "--tilt-x": `${orbit.tiltX}deg`,
                  "--tilt-y": `${orbit.tiltY}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            Ready to build something{" "}
            <span className="text-aurora">unforgettable?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            Spin up your real-time, authenticated blog in minutes. No
            boilerplate, no config hell — just ship.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic>
              <Link
                href="/create"
                className="btn-glow group inline-flex h-14 items-center justify-center gap-2 rounded-full px-9 text-base font-semibold"
              >
                Start Writing
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>

            <Magnetic>
              <Link
                href="/blog"
                className="glass glass-sheen inline-flex h-14 items-center justify-center rounded-full px-9 text-base font-semibold"
              >
                Explore the Blog
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
