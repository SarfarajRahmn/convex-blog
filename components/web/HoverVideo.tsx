"use client";

/** A muted video thumbnail that plays while the pointer is over it. */
export function HoverVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  return (
    <video
      src={`${src}#t=0.1`}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          return;
        }
        // Playback can be refused or interrupted; the still frame remains.
        event.currentTarget.play().catch(() => {});
      }}
      onPointerLeave={(event) => event.currentTarget.pause()}
    />
  );
}
