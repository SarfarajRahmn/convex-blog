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

export function MarqueeSection() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const row = [...techs, ...techs];

  return (
    <section className="py-16">
      <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Powered by a best-in-class stack
      </p>

      <div className="marquee-mask pause-on-hover relative flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 items-center gap-4 pr-4">
          {row.map((tech, i) => (
            <div
              key={i}
              className="glass glass-sheen flex items-center gap-2.5 whitespace-nowrap rounded-full px-6 py-3 text-base font-semibold"
            >
              <tech.icon className="size-5 text-primary" />
              {tech.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
