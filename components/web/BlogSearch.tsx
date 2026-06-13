"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";

/**
 * Live, debounced blog search backed by the existing `posts.searchPosts`
 * Convex full-text search query. Results appear in a dropdown panel.
 */
export function BlogSearch() {
  const [term, setTerm] = useState("");
  const trimmed = term.trim();

  const results = useQuery(
    api.posts.searchPosts,
    trimmed.length > 0 ? { term: trimmed, limit: 5 } : "skip",
  );

  const isLoading = trimmed.length > 0 && results === undefined;
  const showPanel = trimmed.length > 0;

  return (
    <div className="relative mx-auto mb-10 w-full max-w-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search articles…"
          aria-label="Search articles"
          className="glass h-12 rounded-full border-0 pl-10 pr-10 text-base"
        />
        {term.length > 0 && (
          <button
            type="button"
            onClick={() => setTerm("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl glass shadow-lg">
          {isLoading ? (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Searching…
            </div>
          ) : results && results.length > 0 ? (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {results.map((post) => (
                <li key={post._id}>
                  <Link
                    href={`/blog/${post._id}`}
                    onClick={() => setTerm("")}
                    className="block px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <p className="line-clamp-1 font-medium">{post.title}</p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {post.body}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-muted-foreground">
              No results for “{trimmed}”.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
