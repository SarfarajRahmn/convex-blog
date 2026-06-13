"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
  { value: 50, suffix: "ms", label: "Avg. latency", decimals: 0 },
  { value: 12, suffix: "k+", label: "Developers", decimals: 0 },
  { value: 100, suffix: "%", label: "Open source", decimals: 0 },
];

export function StatsSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const counters = gsap.utils.toArray<HTMLElement>(".stat-value");

      counters.forEach((el) => {
        const target = Number(el.dataset.value);
        const decimals = Number(el.dataset.decimals);
        const suffix = el.dataset.suffix ?? "";
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals) + suffix;
          },
        });
      });

      gsap.fromTo(
        ".stat-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: ".stats-grid", start: "top 88%" },
        },
      );
    },
    { scope: container },
  );

  return (
    <section ref={container} className="px-4 py-20">
      <div className="stats-grid mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card glass glass-sheen flex flex-col items-center rounded-2xl px-4 py-8 opacity-0"
          >
            <span
              className="stat-value text-aurora text-4xl font-extrabold tracking-tight sm:text-5xl"
              data-value={stat.value}
              data-decimals={stat.decimals}
              data-suffix={stat.suffix}
            >
              0{stat.suffix}
            </span>
            <span className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
