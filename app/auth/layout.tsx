import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/web/Logo";
import { SceneCanvas } from "@/components/web/fx/SceneCanvas";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel with the 3D scene (large screens only) */}
      <aside className="relative m-3 hidden overflow-hidden rounded-[2rem] border bg-[#0b0718] text-white lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,rgb(124_58_237/0.45),transparent_70%)]"
        />
        <SceneCanvas className="absolute inset-0 hidden lg:block" />
        <Link href="/" className="relative w-fit">
          <Logo />
        </Link>
        <div className="relative max-w-md space-y-3">
          <p className="text-4xl font-bold leading-tight tracking-[-0.03em]">
            Stories that update the moment you publish.
          </p>
          <p className="text-white/70">
            Write, share media and talk with readers in real time.
          </p>
        </div>
      </aside>

      <div className="relative flex flex-col px-4 py-5">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "rounded-full",
            })}
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <Link href="/" className="lg:hidden">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="rise w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
