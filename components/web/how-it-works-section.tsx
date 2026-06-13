"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LogIn, PenSquare, Share2, Upload } from "lucide-react";

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

export function HowItWorksSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".how-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".how-header", start: "top 85%" },
        },
      );

      gsap.fromTo(
        ".how-step",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: { trigger: ".how-timeline", start: "top 80%" },
        },
      );

      gsap.fromTo(
        ".how-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: ".how-timeline",
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );
    },
    { scope: container },
  );

  return (
    <section ref={container} className="px-4 py-20">
      <div className="mx-auto max-w-3xl space-y-14">
        <div className="how-header mx-auto max-w-2xl space-y-4 text-center opacity-0">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            From zero to published in four simple steps.
          </p>
        </div>

        <div className="how-timeline relative pl-16">
          {/* Track */}
          <div className="absolute left-6.75 top-2 h-[calc(100%-1rem)] w-px bg-border" />
          {/* Animated progress line */}
          <div className="how-line absolute left-6.75 top-2 h-[calc(100%-1rem)] w-px bg-primary" />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <div key={i} className="how-step relative opacity-0">
                <span className="glass absolute -left-16 flex size-14 items-center justify-center rounded-2xl text-primary">
                  <step.icon className="size-6" />
                </span>
                <div className="glass glass-sheen rounded-2xl p-6">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    Step {i + 1}
                  </div>
                  <h3 className="text-lg font-bold sm:text-xl">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
