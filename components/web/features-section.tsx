"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { BookOpen, HomeIcon, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <HomeIcon className="w-8 h-8" />,
    title: "Home Base",
    description: "Your entry point. Navigate through a beautiful, responsive, and blazingly fast landing experience.",
    href: "/",
    cta: "Go Home",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Rich Typography Blog",
    description: "Browse curated content. Rendered server-side with Next.js 16 and cached for ultimate performance.",
    href: "/blog",
    cta: "Visit Blog",
  },
  {
    icon: <PenTool className="w-8 h-8" />,
    title: "Authoring Experience",
    description: "Write your thoughts instantly. Live presence, real-time sync, and rich text powered by Convex.",
    href: "/create",
    cta: "Create Post",
  },
];

export function FeaturesSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Title reveal
      gsap.fromTo(".feature-header",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: {
            trigger: ".feature-header",
            start: "top 85%",
          },
        }
      );

      // Cards stagger
      gsap.fromTo(".feature-card",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 85%",
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative py-20 px-4 bg-muted/30 border-t border-border/50">
      <div className="mx-auto space-y-14">
        
        <div className="feature-header text-center space-y-4 max-w-2xl mx-auto opacity-0">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Everything you need
          </h2>
          <p className="text-muted-foreground text-lg">
            A carefully curated stack giving you unparalleled developer velocity and a stunning user experience out of the box.
          </p>
        </div>

        <div className="features-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="feature-card opacity-0 group relative bg-background rounded-2xl p-7 border hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Card Gradient Glow effect */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              
              <div className="mb-5 inline-flex p-3.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 w-fit">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed flex-1 mb-6 text-sm">
                {feature.description}
              </p>
              
              <div className="mt-auto">
                <Button asChild variant="ghost" className="w-full justify-between group/btn hover:bg-primary/5">
                  <Link href={feature.href}>
                    {feature.cta}
                    <span className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300">
                      →
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
