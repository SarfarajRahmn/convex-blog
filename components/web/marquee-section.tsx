import {
  Atom,
  Boxes,
  Database,
  KeyRound,
  Palette,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const techs = [
  { name: "Next.js 16", icon: Rocket },
  { name: "Convex", icon: Database },
  { name: "Better Auth", icon: KeyRound },
  { name: "React 19", icon: Atom },
  { name: "Tailwind CSS", icon: Palette },
  { name: "GSAP", icon: Sparkles },
  { name: "TypeScript", icon: Boxes },
  { name: "Turbopack", icon: Zap },
];

function Row({ items, reverse }: { items: typeof techs; reverse?: boolean }) {
  // Two identical halves make the -50% translate loop seamlessly.
  const row = [...items, ...items, ...items, ...items];

  return (
    <div className="flex overflow-hidden">
      <div
        className={cn(
          "flex w-max shrink-0 items-center py-2",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        {row.map((tech, i) => (
          // Spacing lives on each item so both halves are exactly equal.
          <div key={i} className="pr-4" aria-hidden={i >= items.length}>
            <div className="surface glass-sheen flex items-center gap-3 whitespace-nowrap rounded-2xl px-7 py-4 text-base font-semibold transition-transform duration-300 hover:-translate-y-1 hover:scale-105">
              <tech.icon className="size-5 text-primary" />
              {tech.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarqueeSection() {
  return (
    <section className="py-12">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        Powered by a best-in-class stack
      </p>

      <div className="marquee-mask pause-on-hover -rotate-1 space-y-2">
        <Row items={techs} />
        <Row items={[...techs].reverse()} reverse />
      </div>
    </section>
  );
}
