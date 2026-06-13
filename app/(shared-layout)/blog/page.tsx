import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogSearch } from "@/components/web/BlogSearch";
import { api } from "@/convex/_generated/api";
import { getReadingTime, formatDate } from "@/lib/utils";
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
      {/* Glass header */}
      <div className="glass glass-sheen mx-auto mb-10 max-w-4xl rounded-[2rem] px-6 py-12 text-center sm:py-16">
        <span className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
          <Sparkles className="size-4 text-primary" />
          Fresh stories &amp; videos
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          The <span className="text-aurora">ConvexMedia</span> Blog
        </h1>
        <p className="mx-auto max-w-2xl pt-4 text-base text-muted-foreground sm:text-xl">
          Insights, tutorials, and real-time stories — now with video.
        </p>
      </div>

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
        <video
          src={`${post.videoUrl}#t=0.1`}
          poster={post.imageUrl ?? undefined}
          muted
          playsInline
          preload="metadata"
          className={`size-full object-cover ${className ?? ""}`}
        />
        <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          <Play className="size-3 fill-current" />
          Video
        </span>
        <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
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
      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${className ?? ""}`}
    />
  );
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <Card className="group glass glass-sheen overflow-hidden border-0 p-0 transition-all duration-300 hover:-translate-y-1">
      <div className="grid md:grid-cols-2">
        <div className="relative h-60 w-full overflow-hidden md:h-full md:min-h-80">
          <PostMedia post={post} sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <span className="mb-3 w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Featured
          </span>
          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatDate(post._creationTime)}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {getReadingTime(post.body)} min read
            </span>
          </div>
          <Link href={`/blog/${post._id}`}>
            <h2 className="text-2xl font-extrabold tracking-tight transition-colors hover:text-primary sm:text-4xl">
              {post.title}
            </h2>
          </Link>
          <p className="mt-3 line-clamp-3 text-muted-foreground">{post.body}</p>
          <Link
            href={`/blog/${post._id}`}
            className={buttonVariants({ className: "mt-6 w-fit gap-2" })}
          >
            Read article
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="group glass glass-sheen overflow-hidden border-0 pt-0 transition-all duration-300 hover:-translate-y-1.5">
      <div className="relative h-44 w-full overflow-hidden sm:h-48">
        <PostMedia
          post={post}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <CardContent>
        <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(post._creationTime)}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {getReadingTime(post.body)} min read
          </span>
        </div>
        <Link href={`/blog/${post._id}`}>
          <h2 className="line-clamp-2 text-xl font-bold transition-colors hover:text-primary sm:text-2xl">
            {post.title}
          </h2>
        </Link>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {post.body}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          className={buttonVariants({ className: "w-full" })}
          href={`/blog/${post._id}`}
        >
          Read more
        </Link>
      </CardFooter>
    </Card>
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
