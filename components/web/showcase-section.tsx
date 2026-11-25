"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Clock, ImagePlus, Sparkles, Video } from "lucide-react";
import { Cube3D } from "./fx/Cube3D";
import { MOTION_OK, useScrollReveal } from "./fx/use-scroll-reveal";
import { SectionHeading } from "./fx/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const barHeights = [42, 66, 50, 82, 60, 94, 74];

/**
 * An illustration of the editor that starts tipped back in 3D and rotates flat
 * as the visitor scrolls to it.
 */
export function ShowcaseSection() {
  const container = useRef<HTMLElement>(null);
  useScrollReveal(container);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const scroll = {
          trigger: ".showcase-stage",
          start: "top 92%",
          end: "top 18%",
          scrub: 0.6,
        };

        gsap.fromTo(
          ".showcase-window",
          { rotateX: 34, scale: 0.9, y: 40, transformPerspective: 1400 },
          { rotateX: 0, scale: 1, y: 0, ease: "none", scrollTrigger: scroll },
        );

        // Side panels travel further than the window, which adds depth.
        gsap.utils.toArray<HTMLElement>(".showcase-float").forEach((el) => {
          gsap.fromTo(
            el,
            { y: Number(el.dataset.travel) },
            { y: 0, ease: "none", scrollTrigger: scroll },
          );
        });
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} className="py-24 sm:py-32">
      <SectionHeading
        eyebrow="The studio"
        title="Write on one side."
        accent="Watch it come alive."
        description="A focused editor with drag-and-drop media, a live preview and publishing that shows up the moment you hit the button."
      />

      <div className="showcase-stage relative mx-auto mt-16 max-w-5xl">
        <div
          aria-hidden
          className="absolute -inset-x-10 -top-10 h-3/4 bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--violet)_35%,transparent),transparent)]"
        />

        <div
          aria-hidden
          className="showcase-window surface relative origin-bottom overflow-hidden rounded-3xl p-2"
        >
          <div className="rounded-2xl border bg-background/80">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <span className="size-3 rounded-full bg-rose-400/80" />
              <span className="size-3 rounded-full bg-amber-300/80" />
              <span className="size-3 rounded-full bg-emerald-400/80" />
              <span className="mx-auto rounded-md bg-muted px-8 py-1 text-xs text-muted-foreground">
                convexmedia / create
              </span>
            </div>

            <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[1.35fr_1fr]">
              {/* Editor */}
              <div className="space-y-4">
                <div className="rounded-xl border bg-card/60 px-4 py-3 text-base font-semibold sm:text-lg">
                  The day everything clicked
                </div>
                <div className="space-y-3 rounded-xl border bg-card/60 p-4">
                  {[100, 92, 97, 78, 88, 54].map((width, i) => (
                    <div
                      key={i}
                      className="h-2.5 rounded-full bg-foreground/10"
                      style={{ width: `${width}%` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: ImagePlus, label: "Cover image" },
                    { icon: Video, label: "Video" },
                  ].map((slot) => (
                    <div
                      key={slot.label}
                      className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 py-5 text-xs text-muted-foreground"
                    >
                      <slot.icon className="size-5 text-primary" />
                      {slot.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="flex flex-col overflow-hidden rounded-xl border bg-card/60">
                <div className="relative flex h-40 items-end gap-2 overflow-hidden bg-linear-to-br from-violet-600/40 via-fuchsia-500/25 to-sky-500/35 px-5 pt-6 md:h-48">
                  {barHeights.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-white/35"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="space-y-3 p-4">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-primary">
                    Live preview
                  </span>
                  <p className="font-bold leading-snug">
                    The day everything clicked
                  </p>
                  <div className="h-2 w-full rounded-full bg-foreground/10" />
                  <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" />3 min read
                  </p>
                  <div className="btn-glow flex h-10 items-center justify-center gap-2 rounded-full text-sm font-semibold">
                    <Sparkles className="size-4" />
                    Publish Post
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          data-travel="140"
          className="showcase-float absolute -left-6 -top-8 hidden lg:block"
        >
          <Cube3D className="[--cube:58px]">
            <Sparkles className="size-5 text-white/90" />
          </Cube3D>
        </div>
        <div
          data-travel="220"
          className="showcase-float absolute -right-8 bottom-16 hidden lg:block"
        >
          <Cube3D className="[animation-delay:-4s] [--cube:72px]">
            <Video className="size-6 text-white/90" />
          </Cube3D>
        </div>
      </div>
    </section>
  );
}
