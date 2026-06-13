import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { ReadingProgress } from "@/components/web/ReadingProgress";
import { ShareButton } from "@/components/web/ShareButton";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { formatDate, getReadingTime } from "@/lib/utils";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft, Clock, FileQuestion } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface PostIdRouteProps {
  params: Promise<{
    postId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostBySlug, { slug: postId });

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.body.slice(0, 160),
    authors: [{ name: post.authorName }],
  };
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;

  const token = await getToken();

  const post = await fetchQuery(api.posts.getPostBySlug, { slug: postId });

  const [preloadedComments, userId] = await Promise.all([
    post
      ? preloadQuery(api.comments.getCommentsByPostId, { postId: post._id })
      : null,
    fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  // if (!userId) {
  //   return redirect("/auth/login");
  // }

  if (!post || !preloadedComments) {
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

  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const authorInitial = post.authorName.charAt(0).toUpperCase() || "?";

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-6 duration-500 animate-in fade-in sm:py-8">
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

      {/* Post card */}
      <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        {/* Author header */}
        <header className="flex items-center gap-3 p-5 sm:px-6">
          <Avatar className="size-11 ring-2 ring-primary/20">
            {post.authorImage && (
              <AvatarImage src={post.authorImage} alt={post.authorName} />
            )}
            <AvatarFallback className="bg-primary/15 font-semibold text-primary">
              {authorInitial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold leading-tight">
              {post.authorName}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span>{formatDate(post._creationTime)}</span>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {getReadingTime(post.body)} min read
              </span>
            </div>
          </div>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
        </header>

        {/* Title + text */}
        <div className="px-5 pb-4 sm:px-6">
          <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-foreground sm:text-3xl">
            {post.title}
          </h1>
          <div className="mt-4 space-y-4 text-[1.0625rem] leading-8 text-foreground/95">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Media */}
        {post.videoUrl ? (
          <video
            src={post.videoUrl}
            poster={post.imageUrl ?? undefined}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full bg-black object-contain"
          />
        ) : post.imageUrl ? (
          <div className="relative h-64 w-full sm:h-96">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              priority
              className="object-cover"
            />
          </div>
        ) : null}

        {/* Action bar */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 sm:px-6">
          <span className="text-sm text-muted-foreground">
            Enjoyed this story? Share it.
          </span>
          <ShareButton title={post.title} text={post.body.slice(0, 120)} />
        </div>
      </article>

      <Separator className="my-8" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}
