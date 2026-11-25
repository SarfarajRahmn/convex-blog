"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/create", label: "Create" },
];

/** Desktop links with a pill that slides to the hovered or current page. */
function NavPills({ pathname }: { pathname: string | null }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = navLinks.find((link) =>
    link.href === "/"
      ? pathname === "/"
      : pathname?.startsWith(link.href),
  )?.href;
  const target = hovered ?? active;
  const index = navLinks.findIndex((link) => link.href === target);

  return (
    <div
      className="relative hidden grid-cols-3 md:grid"
      onPointerLeave={() => setHovered(null)}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-foreground/8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          translate: `${Math.max(index, 0) * 100}% 0`,
          opacity: index < 0 ? 0 : 1,
        }}
      />
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active === link.href ? "page" : undefined}
          onPointerEnter={() => setHovered(link.href)}
          className={cn(
            "relative rounded-full px-5 py-2 text-center text-sm font-medium transition-colors",
            target === link.href ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function ActiveNavPills() {
  return <NavPills pathname={usePathname()} />;
}

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
          setMobileOpen(false);
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    });
  }

  return (
    <header className="sticky top-3 z-50 w-full px-3 sm:px-4">
      <nav
        className={cn(
          "mx-auto flex items-center justify-between rounded-full border py-2.5 pl-6 pr-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled || mobileOpen
            ? "glass max-w-4xl"
            : "max-w-6xl border-transparent",
        )}
      >
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        {/* The current path is only known at request time on dynamic routes. */}
        <Suspense fallback={<NavPills pathname={null} />}>
          <ActiveNavPills />
        </Suspense>

        {/* Desktop Auth + Theme */}
        <div className="hidden items-center gap-2 md:flex">
          {!isLoading &&
            (isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={handleSignOut}
              >
                Logout
              </Button>
            ) : (
              <>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "rounded-full",
                  })}
                  href="/auth/login"
                >
                  Log In
                </Link>
                <Link
                  className="btn-glow inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold"
                  href="/auth/sign-up"
                >
                  Sign Up
                </Link>
              </>
            ))}
          <ThemeToggle />
        </div>

        {/* Mobile: Theme + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="glass mx-1 mt-2 space-y-1 rounded-3xl bg-popover/95 px-4 pb-6 pt-4 duration-300 animate-in fade-in slide-in-from-top-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={buttonVariants({
                variant: "ghost",
                className: "w-full justify-start",
              })}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 border-t border-border/50 pt-3">
            {!isLoading &&
              (isAuthenticated ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className={buttonVariants({ className: "w-full" })}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className={buttonVariants({
                      variant: "secondary",
                      className: "w-full",
                    })}
                  >
                    Log In
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
