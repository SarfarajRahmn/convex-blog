"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Background shapes
      tl.fromTo(".bg-shape",
        { opacity: 0, scale: 0.6 },
        { opacity: 0.7, scale: 1, duration: 0.8, stagger: 0.1 },
        0
      );

      // Title lines
      tl.fromTo(".hero-title .line",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
        0.1
      );

      // Subtitle
      tl.fromTo(".hero-subtitle",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.35
      );

      // CTA Buttons
      tl.fromTo(".hero-cta",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.7)" },
        0.5
      );

      // Floating background shapes (infinite)
      gsap.to(".bg-shape-1", {
        y: -30, x: 20, rotation: 10,
        duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to(".bg-shape-2", {
        y: 40, x: -20, rotation: -15,
        duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    },
    { scope: container }
  );

  return (
    <section 
      ref={container} 
      className="relative flex-1 flex flex-col items-center justify-center min-h-[85vh] py-20 px-4 text-center overflow-hidden"
    >
      {/* Animated Background Shapes */}
      <div className="bg-shape bg-shape-1 absolute top-[10%] left-[15%] w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-0" />
      <div className="bg-shape bg-shape-2 absolute top-[20%] right-[15%] w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-0" />
      <div className="bg-shape bg-shape-3 absolute -bottom-8 left-[35%] w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-0" />

      {/* Hero Content */}
      <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
        <h1 className="hero-title text-5xl font-extrabold tracking-tight lg:text-7xl overflow-hidden flex flex-col gap-2">
          <span className="line block opacity-0">Ship products faster</span>
          <span className="line block bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-primary/60 opacity-0">
            with Next.js & Convex
          </span>
        </h1>
        
        <p className="hero-subtitle text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium opacity-0">
          A premium open-source template integrating the bleeding edge of the React ecosystem. Production ready, developer approved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button asChild size="lg" className="hero-cta opacity-0 rounded-full px-8 h-14 text-base shadow-lg shadow-primary/25 hover:shadow-xl transition-all hover:-translate-y-1">
            <Link href="/blog">Start Reading</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="hero-cta opacity-0 rounded-full px-8 h-14 text-base bg-background/50 backdrop-blur-sm border-2 hover:-translate-y-1 transition-all"
          >
            <Link href="/create">Write a Post</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
