"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Full-viewport animated "liquid" aurora background. Soft gradient blobs drift
 * continuously and gently parallax toward the cursor, creating a living
 * glass/lava-lamp backdrop that sits behind all page content.
 */
export function LiquidBackground() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const blobs = gsap.utils.toArray<HTMLElement>(".liquid-blob");

      // Continuous organic drift for each blob.
      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          xPercent: gsap.utils.random(-18, 18),
          yPercent: gsap.utils.random(-18, 18),
          scale: gsap.utils.random(0.9, 1.25),
          duration: gsap.utils.random(6, 10),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      });

      // Cursor parallax — blobs lag toward the pointer at different depths.
      const setters = blobs.map((blob) => ({
        x: gsap.quickTo(blob, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(blob, "y", { duration: 1.2, ease: "power3.out" }),
      }));

      function onMove(e: PointerEvent) {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s, i) => {
          const depth = (i + 1) * 26;
          s.x(cx * depth);
          s.y(cy * depth);
        });
      }

      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base tint */}
      <div className="absolute inset-0 bg-background" />

      {/* Aurora blobs */}
      <div className="liquid-blob absolute -left-32 top-[-10%] size-136 rounded-full bg-primary/30 mix-blend-screen blur-[100px] dark:mix-blend-lighten" />
      <div className="liquid-blob absolute right-[-10%] top-[10%] size-120 rounded-full bg-fuchsia-500/25 mix-blend-screen blur-[110px] dark:mix-blend-lighten" />
      <div className="liquid-blob absolute bottom-[-15%] left-[20%] size-144 rounded-full bg-sky-500/25 mix-blend-screen blur-[120px] dark:mix-blend-lighten" />
      <div className="liquid-blob absolute bottom-[5%] right-[15%] size-104 rounded-full bg-violet-500/25 mix-blend-screen blur-[100px] dark:mix-blend-lighten" />

      {/* Subtle noise/contrast veil for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background/60" />
    </div>
  );
}
