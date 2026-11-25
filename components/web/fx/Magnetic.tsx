"use client";

import { cn } from "@/lib/utils";

/** Pulls its child gently toward the mouse while hovered. */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const child = el.firstElementChild as HTMLElement | null;
    if (!child) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * strength;
    const y = (event.clientY - rect.top - rect.height / 2) * strength;
    child.style.translate = `${x}px ${y}px`;
  }

  function onPointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    const child = event.currentTarget.firstElementChild as HTMLElement | null;
    if (child) child.style.translate = "0px 0px";
  }

  return (
    <div
      className={cn("magnetic inline-flex", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}
