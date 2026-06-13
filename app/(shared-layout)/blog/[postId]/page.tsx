import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { ReadingProgress } from "@/components/web/ReadingProgress";
import { ShareButton } from "@/components/web/ShareButton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { formatDate, getReadingTime } from "@/lib/utils";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft, CalendarDays, Clock, FileQuestion } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface PostIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.body,
    authors: [{ name: "Jan marshal" }],
  };
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;

  const token = await getToken();

  const [post, preloadedComments, userId] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { postId: postId }),
    await preloadQuery(api.comments.getCommentsByPostId, {
      postId: postId,
    }),
    await fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  // if (!userId) {
  //   return redirect("/auth/login");
  // }

  if (!post) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center">
        <div className="glass glass-sheen flex w-full flex-col items-center gap-4 rounded-3xl px-6 py-16">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <FileQuestion className="size-8" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Post not found
          </h1>
          <p className="max-w-md text-muted-foreground">
            This story may have been removed or the link is incorrect.
          </p>
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "mt-2 rounded-full",
            })}
            href="/blog"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const [firstLetter, ...restBody] = post.body;

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-6 duration-500 animate-in fade-in sm:py-8">
      <ReadingProgress />

      <Link
        className={buttonVariants({
          variant: "outline",
          className:
            "glass mb-6 rounded-full border-0 backdrop-blur transition-transform hover:-translate-x-0.5",
        })}
        href="/blog"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      {/* Media hero */}
      <div className="glass glass-sheen relative w-full overflow-hidden rounded-3xl border-0 p-1.5">
        {post.videoUrl ? (
          <video
            src={post.videoUrl}
            poster={post.imageUrl ?? undefined}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full rounded-3xl bg-black object-contain"
          />
        ) : (
          <div className="relative h-56 w-full overflow-hidden rounded-3xl sm:h-80 md:h-100">
            <Image
              src={post.imageUrl ?? FALLBACK_IMAGE}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Title card overlapping the media */}
      <div className="glass-strong relative z-10 -mt-10 mx-auto w-[92%] rounded-3xl px-6 py-7 sm:-mt-14 sm:w-[88%] sm:px-9 sm:py-8">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          Article
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {formatDate(post._creationTime)}
          </span>
          <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            {getReadingTime(post.body)} min read
          </span>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
          <div className="ml-auto">
            <ShareButton title={post.title} text={post.body.slice(0, 120)} />
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="glass glass-sheen mt-6 rounded-3xl border-0 p-6 sm:mt-8 sm:p-10">
        <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90 sm:text-lg sm:leading-relaxed">
          <span className="float-left mr-3 mt-1 text-6xl font-extrabold leading-none text-aurora sm:text-7xl">
            {firstLetter}
          </span>
          {restBody.join("")}
        </p>
      </article>

      <Separator className="my-8 sm:my-10" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
