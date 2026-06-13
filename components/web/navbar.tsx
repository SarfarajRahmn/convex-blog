"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/create", label: "Create" },
];

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <nav className="glass glass-sheen mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <h1 className="text-2xl font-bold tracking-tight">
            CONVEX<span className="text-aurora">Media</span>
          </h1>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth + Theme */}
        <div className="hidden md:flex items-center gap-2">
          {!isLoading &&
            (isAuthenticated ? (
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                Logout
              </Button>
            ) : (
              <>
                <Link
                  className={buttonVariants({ size: "sm" })}
                  href="/auth/sign-up"
                >
                  Sign Up
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                  href="/auth/login"
                >
                  Log In
                </Link>
              </>
            ))}
          <ThemeToggle />
        </div>

        {/* Mobile: Theme + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="glass mx-3 mt-2 space-y-1 rounded-2xl px-4 pb-6 pt-4 duration-200 animate-in slide-in-from-top-2 md:hidden">
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

          <div className="pt-3 border-t border-border/50 flex flex-col gap-2">
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
