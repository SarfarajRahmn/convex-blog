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
import { ArrowLeft, Clock } from "lucide-react";
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
      <div>
        <h1 className="text-6xl font-extrabold text-red-500 p-20">
          No post found
        </h1>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-6 duration-500 animate-in fade-in sm:py-8">
      <ReadingProgress />

      <Link
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
        href="/blog"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <div className="relative mb-6 w-full overflow-hidden rounded-xl shadow-sm sm:mb-8">
        {post.videoUrl ? (
          <video
            src={post.videoUrl}
            poster={post.imageUrl ?? undefined}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full bg-black object-contain"
          />
        ) : (
          <div className="relative h-56 w-full sm:h-80 md:h-100">
            <Image
              src={
                post.imageUrl ??
                "https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm text-muted-foreground">
            {formatDate(post._creationTime)}
          </p>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            {getReadingTime(post.body)} min read
          </span>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
          <div className="ml-auto">
            <ShareButton title={post.title} text={post.body.slice(0, 120)} />
          </div>
        </div>
      </div>

      <Separator className="my-6 sm:my-8" />

      <div className="glass rounded-2xl p-6 sm:p-8">
        <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90 sm:text-lg">
          {post.body}
        </p>
      </div>

      <Separator className="my-6 sm:my-8" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}
