import Link from "next/link";
import {
  ArrowRight,
  Database,
  MessageSquare,
  PenSquare,
  Zap,
} from "lucide-react";
import { Cube3D } from "./fx/Cube3D";
import { Magnetic } from "./fx/Magnetic";
import { SceneCanvas } from "./fx/SceneCanvas";

const delay = (seconds: number) =>
  ({ "--delay": `${seconds}s` }) as React.CSSProperties;

const chips = [
  {
    icon: Zap,
    label: "Real-time sync",
    position: "left-0 top-[16%]",
    delay: 0,
  },
  {
    icon: MessageSquare,
    label: "Live comments",
    position: "right-0 top-[38%]",
    delay: 1.4,
  },
  {
    icon: Database,
    label: "Powered by Convex",
    position: "bottom-[12%] left-[8%]",
    delay: 2.6,
  },
];

export function HeroSection() {
  return (
    <section className="relative grid items-center gap-6 pb-10 pt-14 sm:pt-20 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-[1.05fr_1fr] lg:pt-6">
      {/* Copy */}
      <div className="relative z-10 text-center lg:text-left">
        <span className="rise eyebrow">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Real-time. Reactive. Fast.
        </span>

        <h1 className="mt-7 text-[clamp(2.9rem,8vw,5.6rem)] font-bold leading-[0.98] tracking-[-0.05em]">
          <span className="rise block" style={delay(0.08)}>
            Ship products
          </span>
          <span className="rise block" style={delay(0.16)}>
            faster with
          </span>
          <span className="rise block" style={delay(0.24)}>
            <span className="text-aurora">Next.js &amp; Convex</span>
          </span>
        </h1>

        <p
          className="rise mx-auto mt-7 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl lg:mx-0"
          style={delay(0.34)}
        >
          A premium open-source template integrating the bleeding edge of the
          React ecosystem. Production ready, developer approved.
        </p>

        <div
          className="rise mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          style={delay(0.44)}
        >
          <Magnetic className="w-full sm:w-auto">
            <Link
              href="/blog"
              className="btn-glow group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-9 text-base font-semibold sm:w-auto"
            >
              Start Reading
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <Link
              href="/create"
              className="glass glass-sheen inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-9 text-base font-semibold sm:w-auto"
            >
              <PenSquare className="size-4" />
              Write a Post
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* 3D stage */}
      <div
        className="rise relative mx-auto aspect-square w-full max-w-md sm:max-w-lg lg:max-w-none"
        style={delay(0.2)}
      >
        <div
          aria-hidden
          className="absolute inset-[14%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--violet)_42%,transparent),transparent)]"
        />
        <SceneCanvas className="absolute inset-0" />

        <Cube3D className="absolute right-[12%] top-[8%] [--cube:46px]" />
        <Cube3D className="absolute bottom-[10%] right-[18%] [animation-delay:-3s] [--cube:28px]" />

        {chips.map((chip) => (
          <div
            key={chip.label}
            className={`glass float absolute flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold sm:px-4 sm:py-2.5 sm:text-sm ${chip.position}`}
            style={delay(chip.delay)}
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <chip.icon className="size-4" />
            </span>
            {chip.label}
          </div>
        ))}
      </div>
    </section>
  );
}
