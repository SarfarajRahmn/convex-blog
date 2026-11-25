import Link from "next/link";
import { Github, PersonStanding, Twitter } from "lucide-react";
import { CurrentYear } from "./CurrentYear";
import { Logo } from "./Logo";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Create Post", href: "/create" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log In", href: "/auth/login" },
      { label: "Sign Up", href: "/auth/sign-up" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Next.js", href: "https://nextjs.org" },
      { label: "Convex", href: "https://convex.dev" },
      { label: "Better Auth", href: "https://better-auth.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="px-3 pb-6 sm:px-4">
      <div className="surface mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 pt-12 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              A real-time, open-source blogging platform built with Next.js 16,
              Convex, and Better Auth.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/SarfarajRahmn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="surface flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:rotate-6 hover:border-primary/50 hover:text-primary"
              >
                <Github className="size-4" />
              </a>
              <a
                href="https://x.com/FarazVille"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="surface flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:rotate-6 hover:border-primary/50 hover:text-primary"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="https://farazrahmn.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="surface flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:rotate-6 hover:border-primary/50 hover:text-primary"
              >
                <PersonStanding className="size-4" />
              </a>
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © <CurrentYear /> ConvexMedia. All rights reserved.
          </p>
          <p>Built with Next.js, Convex & Better Auth.</p>
        </div>

        <p
          aria-hidden
          className="wordmark mt-8 select-none text-center text-[clamp(2.4rem,11.2vw,8.5rem)] font-bold leading-[0.85] tracking-[-0.06em]"
        >
          CONVEXMedia
        </p>
      </div>
    </footer>
  );
}
