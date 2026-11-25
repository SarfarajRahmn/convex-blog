"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, HomeIcon, PenTool } from "lucide-react";
import { TiltCard } from "./fx/TiltCard";
import { SectionHeading } from "./fx/SectionHeading";
import { useScrollReveal } from "./fx/use-scroll-reveal";

/** Three stacked pages that fan out when the card is hovered. */
function PagesVisual() {
  return (
    <div className="relative mx-auto h-40 w-32">
      {[
        "-rotate-3 group-hover/tilt:-translate-x-16 group-hover/tilt:-rotate-12",
        "rotate-3 group-hover/tilt:translate-x-16 group-hover/tilt:rotate-12",
        "group-hover/tilt:-translate-y-3",
      ].map((motion, i) => (
        <div
          key={i}
          className={`absolute inset-0 space-y-2 rounded-xl border bg-card p-3 shadow-xl transition-transform duration-500 ease-out ${motion}`}
        >
          <div className="h-14 rounded-md bg-linear-to-br from-violet-500/70 via-fuchsia-500/50 to-sky-400/60" />
          <div className="h-2 w-4/5 rounded-full bg-foreground/25" />
          <div className="h-2 w-full rounded-full bg-foreground/10" />
          <div className="h-2 w-full rounded-full bg-foreground/10" />
          <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}

/** Concentric rings that spread apart on hover. */
function RingsVisual() {
  return (
    <div className="relative mx-auto flex size-40 items-center justify-center">
      {[40, 66, 92].map((size, i) => (
        <span
          key={size}
          className="absolute rounded-full border border-primary/35 transition-transform duration-700 ease-out group-hover/tilt:scale-[1.18]"
          style={{
            width: `${size + 48}px`,
            height: `${size + 48}px`,
            transitionDelay: `${i * 60}ms`,
          }}
        />
      ))}
      <span className="btn-glow flex size-16 items-center justify-center rounded-2xl">
        <HomeIcon className="size-7" />
      </span>
    </div>
  );
}

/** Lines of text that write themselves out on hover. */
function EditorVisual() {
  return (
    <div className="mx-auto flex h-40 w-full max-w-60 flex-col justify-center gap-3 rounded-xl border bg-card/70 p-4">
      {["w-3/5", "w-full", "w-11/12", "w-4/5", "w-2/5"].map((width, i) => (
        <div key={i} className={`h-2.5 ${width}`}>
          <div
            className="h-full w-full origin-left scale-x-50 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-400 opacity-50 transition-all duration-700 ease-out group-hover/tilt:scale-x-100 group-hover/tilt:opacity-100"
            style={{ transitionDelay: `${i * 90}ms` }}
          />
        </div>
      ))}
    </div>
  );
}

const features = [
  {
    icon: HomeIcon,
    visual: RingsVisual,
    title: "Home Base",
    description:
      "Your entry point. Navigate through a beautiful, responsive, and blazingly fast landing experience.",
    href: "/",
    cta: "Go Home",
  },
  {
    icon: BookOpen,
    visual: PagesVisual,
    title: "Rich Typography Blog",
    description:
      "Browse curated content. Rendered server-side with Next.js 16 and cached for ultimate performance.",
    href: "/blog",
    cta: "Visit Blog",
  },
  {
    icon: PenTool,
    visual: EditorVisual,
    title: "Authoring Experience",
    description:
      "Write your thoughts instantly. Live presence, real-time sync, and rich text powered by Convex.",
    href: "/create",
    cta: "Create Post",
  },
];

export function FeaturesSection() {
  const container = useRef<HTMLElement>(null);
  useScrollReveal(container);

  return (
    <section ref={container} className="py-24">
      <div className="mx-auto max-w-6xl space-y-16">
        <SectionHeading
          eyebrow="Platform"
          title="Everything"
          accent="you need"
          description="A carefully curated stack giving you unparalleled developer velocity and a stunning user experience out of the box."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, i) => (
            <div key={feature.title} data-reveal data-reveal-delay={i * 0.12}>
              <TiltCard
                className="h-full"
                innerClassName="flex flex-col rounded-3xl p-7"
              >
                <div className="depth-lg flex h-52 items-center justify-center">
                  <feature.visual />
                </div>

                <div className="depth-sm mt-4 flex flex-1 flex-col">
                  <h3 className="flex items-center gap-3 text-xl font-bold tracking-tight">
                    <feature.icon className="size-5 text-primary" />
                    {feature.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>

                  {/* The stretched link makes the whole card clickable. */}
                  <Link
                    href={feature.href}
                    className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary after:absolute after:inset-0 after:z-10 after:rounded-3xl"
                  >
                    {feature.cta}
                    <ArrowUpRight className="size-4 transition-transform group-hover/tilt:-translate-y-0.5 group-hover/tilt:translate-x-0.5" />
                  </Link>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
