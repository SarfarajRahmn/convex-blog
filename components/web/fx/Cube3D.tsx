import { cn } from "@/lib/utils";

const faces = ["front", "back", "right", "left", "top", "bottom"] as const;

/**
 * A floating glass cube built from six CSS faces. Set its size with `--cube`.
 * An optional icon is shown on every face.
 */
export function Cube3D({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div aria-hidden className={cn("cube-scene pointer-events-none", className)}>
      <div className="cube">
        {faces.map((face) => (
          <span key={face} className={`cube-face cube-face-${face}`}>
            {children}
          </span>
        ))}
      </div>
    </div>
  );
}
