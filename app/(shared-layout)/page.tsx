import { HeroSection } from "@/components/web/hero-section";
import { MarqueeSection } from "@/components/web/marquee-section";
import { StatsSection } from "@/components/web/stats-section";
import { FeaturesSection } from "@/components/web/features-section";
import { HowItWorksSection } from "@/components/web/how-it-works-section";
import { TestimonialsSection } from "@/components/web/testimonials-section";
import { FaqSection } from "@/components/web/faq-section";
import { NewsletterSection } from "@/components/web/newsletter-section";
import { CtaSection } from "@/components/web/cta-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <MarqueeSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <NewsletterSection />
      <CtaSection />
    </div>
  );
}
