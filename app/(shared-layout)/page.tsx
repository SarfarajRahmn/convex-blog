import { HeroSection } from "@/components/web/hero-section";
import { FeaturesSection } from "@/components/web/features-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
