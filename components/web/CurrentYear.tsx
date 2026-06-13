"use client";

import { useEffect, useState } from "react";

/**
 * Renders the current year on the client to avoid reading `new Date()` during
 * the server prerender of cached routes (Next.js 16 Cache Components).
 */
export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year ?? ""}</>;
}
