"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Fades every `[data-reveal]` element inside `scope` up into place, with a
 * slight 3D swing, as it enters the viewport. `data-reveal-delay` staggers
 * siblings. Elements stay visible if motion is reduced.
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            {
              autoAlpha: 0,
              y: 56,
              rotateX: -14,
              transformPerspective: 900,
              transformOrigin: "50% 100%",
            },
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 1,
              delay: Number(el.dataset.revealDelay ?? 0),
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            },
          );
        });
      });
    },
    { scope },
  );
}
