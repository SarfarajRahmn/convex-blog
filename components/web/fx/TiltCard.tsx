"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  /** Classes for the outer, non-moving wrapper (use for grid spans). */
  className?: string;
  /** Classes for the tilting surface. */
  innerClassName?: string;
  /** Maximum rotation in degrees. */
  max?: number;
}

/**
 * A card that tilts in 3D toward the mouse with a spotlight that follows it.
 * Children using the `depth-*` classes float above the surface.
 *
 * Values are written straight to CSS variables, so moving the mouse never
 * re-renders React. Touch input is ignored.
 */
export function TiltCard({
  children,
  className,
  innerClassName,
  max = 8,
}: TiltCardProps) {
  const inner = useRef<HTMLDivElement>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = inner.current;
    if (!el || event.pointerType !== "mouse") return;

    // Measure the wrapper: it does not rotate, so the numbers stay stable.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  }

  function reset() {
    inner.current?.style.setProperty("--rx", "0deg");
    inner.current?.style.setProperty("--ry", "0deg");
  }

  return (
    <div
      className={cn("tilt-scene group/tilt", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <div ref={inner} className={cn("tilt surface h-full", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
