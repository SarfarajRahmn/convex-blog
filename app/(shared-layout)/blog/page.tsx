import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogSearch } from "@/components/web/BlogSearch";
import { HoverVideo } from "@/components/web/HoverVideo";
import { TiltCard } from "@/components/web/fx/TiltCard";
import { Cube3D } from "@/components/web/fx/Cube3D";
import { api } from "@/convex/_generated/api";
import { getReadingTime, formatDate, postPath } from "@/lib/utils";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, PenSquare, Play, Sparkles } from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog | Next.js 16 Tutorial",
  description: "Read our latest articles and insights.",
  category: "Web development",
  authors: [{ name: "Sarfaraj Rahman" }],
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function BlogPage() {
  return (
    <div className="py-8 sm:py-12">
      <header className="relative mx-auto mb-12 max-w-4xl py-8 text-center sm:py-14">
        <Cube3D className="absolute left-0 top-10 hidden md:block [--cube:52px]" />
        <Cube3D className="absolute bottom-8 right-2 hidden md:block [animation-delay:-3s] [--cube:36px]" />
        <span className="rise eyebrow">
          <Sparkles className="size-3.5 text-primary" />
          Fresh stories &amp; videos
        </span>
        <h1 className="rise mt-6 text-5xl font-bold leading-none tracking-[-0.045em] [--delay:0.08s] sm:text-6xl md:text-7xl">
          The <span className="text-aurora">ConvexMedia</span> Blog
        </h1>
        <p className="rise mx-auto max-w-2xl pt-6 text-base text-muted-foreground [--delay:0.16s] sm:text-xl">
          Insights, tutorials, and real-time stories — now with video.
        </p>
      </header>

      <BlogSearch />

      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogList />
      </Suspense>
    </div>
  );
}

async function LoadBlogList() {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");

  const data = await fetchQuery(api.posts.getPosts);

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  const [featured, ...rest] = data;

  return (
    <div className="space-y-10">
      <FeaturedPost post={featured} />

      {rest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

type Post = Awaited<
  ReturnType<typeof fetchQuery<typeof api.posts.getPosts>>
>[number];

function PostMedia({
  post,
  sizes,
  className,
}: {
  post: Post;
  sizes: string;
  className?: string;
}) {
  if (post.videoUrl) {
    return (
      <>
        <HoverVideo
          src={post.videoUrl}
          poster={post.imageUrl ?? undefined}
          className={`size-full object-cover ${className ?? ""}`}
        />
        <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          <Play className="size-3 fill-current" />
          Video
        </span>
        <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 group-hover/tilt:opacity-0">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/25 backdrop-blur transition-transform group-hover:scale-110">
            <Play className="size-6 fill-white text-white" />
          </span>
        </span>
      </>
    );
  }

  return (
    <Image
      src={post.imageUrl ?? FALLBACK_IMAGE}
      alt={post.title}
      fill
      sizes={sizes}
      className={`object-cover transition-transform duration-700 ease-out group-hover/tilt:scale-110 ${className ?? ""}`}
    />
  );
}

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span>{formatDate(post._creationTime)}</span>
      <span className="flex items-center gap-1">
        <Clock className="size-3" />
        {getReadingTime(post.body)} min read
      </span>
    </div>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <TiltCard max={5} innerClassName="rounded-[2rem] p-2">
      <article className="grid md:grid-cols-[1.15fr_1fr]">
        <div className="relative h-60 w-full overflow-hidden rounded-3xl sm:h-72 md:h-[26rem]">
          <PostMedia post={post} sizes="(max-width: 768px) 100vw, 55vw" />
        </div>
        <div className="depth-sm flex flex-col items-start justify-center p-6 sm:p-10">
          <span className="btn-glow mb-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            Featured
          </span>
          <PostMeta post={post} />
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">
            <Link
              href={postPath(post)}
              className="transition-colors hover:text-primary"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 line-clamp-3 text-muted-foreground">{post.body}</p>
          <Link
            href={postPath(post)}
            className="btn-glow mt-7 inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold"
          >
            Read article
            <ArrowRight className="size-4 transition-transform group-hover/tilt:translate-x-1" />
          </Link>
        </div>
      </article>
    </TiltCard>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <div className="reveal-view">
      <TiltCard
        className="h-full"
        innerClassName="flex flex-col rounded-3xl p-2"
        max={10}
      >
        <div className="relative h-48 w-full overflow-hidden rounded-2xl">
          <PostMedia
            post={post}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="depth-sm flex flex-1 flex-col p-4">
          <PostMeta post={post} />
          <h2 className="mt-3 line-clamp-2 text-xl font-bold tracking-tight">
            <Link
              href={postPath(post)}
              className="transition-colors hover:text-primary"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {post.body}
          </p>
          <Link
            href={postPath(post)}
            className="mt-auto inline-flex w-fit items-center gap-1.5 pt-5 text-sm font-semibold text-primary"
          >
            Read more
            <ArrowRight className="size-4 transition-transform group-hover/tilt:translate-x-1" />
          </Link>
        </div>
      </TiltCard>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass mx-auto flex max-w-xl flex-col items-center rounded-3xl px-6 py-16 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <PenSquare className="size-7" />
      </span>
      <h2 className="text-2xl font-bold">No posts yet</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Be the first to share a story or a video with the community.
      </p>
      <Link
        href="/create"
        className={buttonVariants({ className: "mt-6 gap-2" })}
      >
        <PenSquare className="size-4" />
        Write the first post
      </Link>
    </div>
  );
}

function SkeletonLoadingUi() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-72 w-full rounded-[2rem]" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div className="flex flex-col space-y-3" key={i}>
            <Skeleton className="h-44 w-full rounded-xl sm:h-48" />
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
