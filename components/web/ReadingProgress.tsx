"use client";

import { useEffect, useRef } from "react";

/**
 * A fixed top progress bar that reflects how far the user has scrolled down
 * the page. Great for long-form reading on mobile.
 */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Written straight to the DOM so scrolling never re-renders React.
    function onScroll() {
      const el = bar.current;
      if (!el) return;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? window.scrollY / docHeight : 0;
      const clamped = Math.min(1, Math.max(0, ratio));
      el.style.transform = `scaleX(${clamped})`;
      el.setAttribute("aria-valuenow", String(Math.round(clamped * 100)));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-60 h-1">
      <div
        ref={bar}
        className="h-full origin-left scale-x-0 bg-linear-to-r from-violet-500 via-fuchsia-500 to-sky-400"
        role="progressbar"
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
    </div>
  );
}
