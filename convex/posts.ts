import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

/** Turn a title into a URL-friendly slug (matches lib/utils slugify). */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a slug that is unique across all posts. If the base slug is taken,
 * it "self-heals" by appending an incrementing suffix: `my-title-2`, `-3`, …
 */
async function generateUniqueSlug(
  ctx: MutationCtx,
  title: string,
): Promise<string> {
  const base = slugify(title) || "post";

  let candidate = base;
  let suffix = 2;

  // Probe the index until we find a free slug.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", candidate))
      .first();

    if (!existing) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    videoStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const slug = await generateUniqueSlug(ctx, args.title);

    const blogArticle = await ctx.db.insert("posts", {
      body: args.body,
      title: args.title,
      authorId: user._id,
      slug,
      imageStorageId: args.imageStorageId,
      videoStorageId: args.videoStorageId,
    });

    return blogArticle;
  },
});

/** One-time backfill: assigns unique slugs to posts created before slugs existed. */
export const backfillSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("asc").collect();

    let updated = 0;
    for (const post of posts) {
      if (post.slug) continue;
      const slug = await generateUniqueSlug(ctx, post.title);
      await ctx.db.patch(post._id, { slug });
      updated += 1;
    }

    return { updated };
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();

    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        const resolvedVideoUrl =
          post.videoStorageId !== undefined
            ? await ctx.storage.getUrl(post.videoStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
          videoUrl: resolvedVideoUrl,
        };
      }),
    );
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      return null;
    }

    const resolvedImageUrl =
      post?.imageStorageId !== undefined
        ? await ctx.storage.getUrl(post.imageStorageId)
        : null;

    const resolvedVideoUrl =
      post?.videoStorageId !== undefined
        ? await ctx.storage.getUrl(post.videoStorageId)
        : null;

    const author = await authComponent.getAnyUserById(ctx, post.authorId);

    return {
      ...post,
      imageUrl: resolvedImageUrl,
      videoUrl: resolvedVideoUrl,
      authorName: author?.name ?? "Anonymous",
      authorImage: author?.image ?? null,
    };
  },
});

export const getPostBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const target = slugify(decodeURIComponent(args.slug));

    // Fast path: look up by the stored unique slug.
    let post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", target))
      .first();

    // Legacy fallback: posts created before slugs existed.
    if (!post) {
      const posts = await ctx.db.query("posts").order("desc").collect();
      post = posts.find((p) => (p.slug ?? slugify(p.title)) === target) ?? null;
    }

    if (!post) {
      return null;
    }

    const resolvedImageUrl =
      post.imageStorageId !== undefined
        ? await ctx.storage.getUrl(post.imageStorageId)
        : null;

    const resolvedVideoUrl =
      post.videoStorageId !== undefined
        ? await ctx.storage.getUrl(post.videoStorageId)
        : null;

    const author = await authComponent.getAnyUserById(ctx, post.authorId);

    return {
      ...post,
      imageUrl: resolvedImageUrl,
      videoUrl: resolvedVideoUrl,
      authorName: author?.name ?? "Anonymous",
      authorImage: author?.image ?? null,
    };
  },
});

interface searchResultTypes {
  _id: string;
  title: string;
  body: string;
}

export const searchPosts = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = args.limit;

    const results: Array<searchResultTypes> = [];

    const seen = new Set();

    const pushDocs = async (docs: Array<Doc<"posts">>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        results.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body,
        });
        if (results.length >= limit) break;
      }
    };

    const titleMatches = await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) => q.search("title", args.term))
      .take(limit);

    await pushDocs(titleMatches);

    if (results.length < limit) {
      const bodyMatches = await ctx.db
        .query("posts")
        .withSearchIndex("search_body", (q) => q.search("body", args.term))
        .take(limit);

      await pushDocs(bodyMatches);
    }

    return results;
  },
});
