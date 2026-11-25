"use client";

import { useEffect, useRef } from "react";

/**
 * Page backdrop: static colour washes, a faint grid and a soft light that
 * follows the mouse. Nothing here runs a continuous animation or a blur
 * filter, so it costs very little to render.
 */
export function LiquidBackground() {
  const light = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!light.current) return;
        light.current.style.opacity = "1";
        light.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      });
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div className="backdrop-wash absolute inset-0" />
      <div className="backdrop-grid absolute inset-0" />
      <div ref={light} className="cursor-light" />
    </div>
  );
}
