"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TiltCard } from "./fx/TiltCard";
import { MOTION_OK, useScrollReveal } from "./fx/use-scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
  { value: 50, suffix: "ms", label: "Avg. latency", decimals: 0 },
  { value: 12, suffix: "k+", label: "Developers", decimals: 0 },
  { value: 100, suffix: "%", label: "Open source", decimals: 0 },
];

export function StatsSection() {
  const container = useRef<HTMLElement>(null);
  useScrollReveal(container);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
          const target = Number(el.dataset.value);
          const decimals = Number(el.dataset.decimals);
          const suffix = el.dataset.suffix ?? "";
          const counter = { value: 0 };

          gsap.to(counter, {
            value: target,
            duration: 2.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = counter.value.toFixed(decimals) + suffix;
            },
          });
        });
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} className="py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label} data-reveal data-reveal-delay={i * 0.1}>
            <TiltCard
              className="h-full"
              innerClassName="flex flex-col items-center rounded-3xl px-4 py-10"
              max={16}
            >
              {/* The server renders the final value; the count-up is extra. */}
              <span
                className="stat-value depth-lg text-aurora text-4xl font-bold tracking-tighter tabular-nums sm:text-6xl"
                data-value={stat.value}
                data-decimals={stat.decimals}
                data-suffix={stat.suffix}
              >
                {stat.value.toFixed(stat.decimals) + stat.suffix}
              </span>
              <span className="depth-sm mt-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {stat.label}
              </span>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}
