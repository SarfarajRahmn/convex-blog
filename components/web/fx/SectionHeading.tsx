import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={cn("mx-auto max-w-2xl space-y-5 text-center", className)}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
        {title} <span className="text-aurora">{accent}</span>
      </h2>
      <p className="text-base text-pretty text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}
