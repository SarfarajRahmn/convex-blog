import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Estimate reading time in minutes from a body of text (~200 wpm). */
export function getReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Format a timestamp as a friendly date, e.g. "Jun 13, 2026". */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Turn a title into a URL-friendly slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Build a readable post URL like `/blog/my-post-title`.
 * Prefers the post's stored unique slug; falls back to slugifying the title.
 */
export function postPath(post: {
  _id: string;
  title: string;
  slug?: string | null;
}): string {
  const slug = post.slug ?? slugify(post.title);
  return slug ? `/blog/${slug}` : `/blog/${post._id}`;
}
