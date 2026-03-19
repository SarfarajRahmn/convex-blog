"use client";

import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Separator } from "../ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {
  const params = useParams<{ postId: Id<"posts"> }>();
  const data = usePreloadedQuery(props.preloadedComments);
  const [isPending, startTransition] = useTransition();
  const { data: session } = authClient.useSession();
  const authorName = session?.user?.name || "Anonymous";

  const createComment = useMutation(api.comments.createComment);
  const deleteComment = useMutation(api.comments.deleteComment);
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  async function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to create post");
      }
    });
  }

  if (data === undefined) {
    return <p>loading...</p>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{data.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        {session ? (
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Comment as {authorName}</FieldLabel>
                  <Textarea
                    aria-invalid={fieldState.invalid}
                    placeholder="Share your thoughts"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Comment</span>
              )}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg bg-muted/10">
            <p className="mb-4 text-sm text-muted-foreground">
              You must be logged in to share your thoughts.
            </p>
            <Link href="/auth/login">
              <Button variant="outline">Log in to comment</Button>
            </Link>
          </div>
        )}

        {/* Only show separator and comments section if there are comments */}
        {data?.length > 0 && (
          <>
            <Separator />

            <section
              className={`space-y-6 overflow-y-scroll scrollbar-hide pr-3 ${
                data.length === 1 ? "h-0" : "max-h-60"
              }`}
            >
              {data?.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${comment.authorName}`}
                      alt={comment.authorName}
                    />
                    <AvatarFallback>
                      {comment.authorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">
                        {comment.authorName}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground text-xs">
                          {new Date(comment._creationTime).toLocaleDateString(
                            "en-US",
                          )}
                        </p>
                        {session?.user?.name === comment.authorName && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Delete comment"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. Your comment will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={async () => {
                                    try {
                                      await deleteComment({ commentId: comment._id });
                                      toast.success("Comment deleted");
                                    } catch {
                                      toast.error("Failed to delete comment");
                                    }
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}
