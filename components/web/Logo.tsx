export function Logo() {
  return (
    <span className="group/logo flex items-center gap-2.5 text-lg font-bold tracking-tight">
      <span className="btn-glow flex size-8 items-center justify-center rounded-[0.7rem] transition-transform duration-500 group-hover/logo:rotate-[135deg]">
        <span className="size-3 rotate-45 rounded-[3px] bg-white" />
      </span>
      <span>
        CONVEX<span className="text-aurora">Media</span>
      </span>
    </span>
  );
}
