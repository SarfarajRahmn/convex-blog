"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LogIn, PenSquare, Share2, Upload } from "lucide-react";
import { Cube3D } from "./fx/Cube3D";
import { SectionHeading } from "./fx/SectionHeading";
import { MOTION_OK, useScrollReveal } from "./fx/use-scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: LogIn,
    title: "Create your account",
    description:
      "Sign up in seconds with secure email & password auth powered by Better Auth.",
  },
  {
    icon: Upload,
    title: "Upload media",
    description:
      "Attach a cover image or upload a full video — stored and streamed straight from Convex.",
  },
  {
    icon: PenSquare,
    title: "Write & publish",
    description:
      "Craft your post and hit publish. It appears instantly thanks to real-time sync.",
  },
  {
    icon: Share2,
    title: "Share & engage",
    description:
      "Share your story, watch live presence, and reply to comments as they roll in.",
  },
];

/** Cards pin to the top and stack; earlier ones recede as you scroll. */
export function HowItWorksSection() {
  const container = useRef<HTMLElement>(null);
  useScrollReveal(container);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>(".step-item");
        const cards = gsap.utils.toArray<HTMLElement>(".step-card");

        // Depth comes from how far later cards actually overlap each one. The
        // list items are never transformed, so their positions stay reliable.
        function update() {
          const rects = items.map((item) => item.getBoundingClientRect());
          cards.forEach((card, i) => {
            const { top, height } = rects[i];
            const depth = rects
              .slice(i + 1)
              .reduce(
                (sum, next) =>
                  sum + gsap.utils.clamp(0, 1, (top + height - next.top) / height),
                0,
              );
            gsap.set(card, {
              scale: 1 - depth * 0.045,
              rotateX: -7 * Math.min(depth, 1),
              transformPerspective: 1000,
              transformOrigin: "50% 0%",
              "--shade": Math.min(depth * 0.45, 0.65),
            });
          });
        }

        ScrollTrigger.create({
          trigger: ".step-list",
          start: "top bottom",
          end: "bottom top",
          onUpdate: update,
          onRefresh: update,
        });
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} className="py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Workflow"
          title="From zero to published in"
          accent="four steps"
          description="Create an account, add your media, write, and share. That is the whole workflow."
        />

        <ol className="step-list mt-16 space-y-[14vh]">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="step-item sticky"
              style={{ top: `calc(7rem + ${i * 1.1}rem)` }}
            >
              <div className="step-card relative overflow-hidden rounded-[2rem] border bg-card p-7 shadow-2xl shadow-black/20 sm:p-12">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(80%_120%_at_100%_0%,color-mix(in_oklch,var(--violet)_24%,transparent),transparent_65%)]"
                />

                <div className="relative flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-md">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {step.description}
                    </p>
                  </div>

                  <div className="flex size-28 shrink-0 items-center justify-center self-center sm:size-40">
                    <Cube3D
                      className="[--cube:68px] sm:[--cube:96px]"
                    >
                      <step.icon className="size-8 text-foreground sm:size-10" />
                    </Cube3D>
                  </div>
                </div>

                {/* Dims the card once a newer one covers it. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-background"
                  style={{ opacity: "var(--shade, 0)" }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
