import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-background">
      {/* Ambient background blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/15 rounded-full filter blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-500/15 rounded-full filter blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-[40%] left-[55%] w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl opacity-50 pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-5 left-5 z-10">
        <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      {/* Brand mark */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2">
        <Link href="/" className="text-xl font-bold tracking-tight">
          CONVEX<span className="text-primary">Media</span>
        </Link>
      </div>

      {/* Form card */}
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
