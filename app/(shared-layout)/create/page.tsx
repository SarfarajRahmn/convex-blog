"use client";

import { createBlogAction } from "@/app/actions";
import { postSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getReadingTime } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import {
  Clock,
  ImagePlus,
  Loader2,
  Sparkles,
  Type,
  Video,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const TITLE_MAX = 50;

const PROMPTS = [
  "The one thing nobody tells you about…",
  "How I finally fixed…",
  "5 lessons I learned building…",
  "A love letter to…",
  "Why I changed my mind about…",
  "The day everything clicked…",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CreateRoute() {
  const [isPending, startTransition] = useTransition();
  const container = useRef<HTMLDivElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [dragOver, setDragOver] = useState<"image" | "video" | null>(null);

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      title: "",
      image: undefined,
      video: undefined,
    },
  });

  const title = form.watch("title") ?? "";
  const content = form.watch("content") ?? "";

  const charsLeft = TITLE_MAX - title.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = getReadingTime(content);

  useGSAP(
    () => {
      gsap.fromTo(
        ".create-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    },
    { scope: container },
  );

  // Clean up object URLs to avoid memory leaks.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imagePreview, videoPreview]);

  function celebrate() {
    const colors = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ede9fe"];
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors,
    });
  }

  function setMediaFile(
    kind: "image" | "video",
    file: File | undefined,
    onChange: (file: File | undefined) => void,
  ) {
    onChange(file);
    if (kind === "image") {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(file ? URL.createObjectURL(file) : null);
    }
  }

  function handleDrop(
    kind: "image" | "video",
    event: React.DragEvent<HTMLLabelElement>,
    onChange: (file: File | undefined) => void,
  ) {
    event.preventDefault();
    setDragOver(null);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    const accepted = kind === "image" ? "image/" : "video/";
    if (!file.type.startsWith(accepted)) {
      toast.error(`That doesn't look like a ${kind}`);
      return;
    }
    setMediaFile(kind, file, onChange);
  }

  function onSubmit(values: z.infer<typeof postSchema>) {
    startTransition(async () => {
      const result = await createBlogAction(values);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // No error result means the action succeeded and is redirecting.
      celebrate();
      toast.success("Post published! Redirecting…");
    });
  }

  function rollPrompt() {
    let next = promptIndex;
    while (next === promptIndex) {
      next = Math.floor(Math.random() * PROMPTS.length);
    }
    setPromptIndex(next);
    if (!title) {
      form.setValue("title", PROMPTS[next], { shouldValidate: true });
    }
  }

  return (
    <div ref={container} className="py-8 sm:py-12">
      {/* Header */}
      <div className="create-reveal mb-8 text-center sm:mb-10">
        <span className="glass mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="size-4 animate-pulse" />
          Let&apos;s make something great
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Create a <span className="text-aurora">story</span>
        </h1>
        <p className="px-4 pt-3 text-base text-muted-foreground sm:text-lg">
          Write it, drop in some media, and share it with the world.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="create-reveal glass glass-sheen rounded-3xl border-0 p-6 sm:p-8"
        >
          <FieldGroup className="gap-y-6">
            {/* Inspiration */}
            <button
              type="button"
              onClick={rollPrompt}
              className="glass group flex items-center gap-2 self-start rounded-full px-4 py-1.5 text-sm font-medium text-primary transition-transform hover:-translate-y-0.5"
            >
              <Wand2 className="size-4 transition-transform group-hover:rotate-12" />
              Need a spark? Try a prompt
            </button>

            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel className="flex items-center gap-1.5">
                      <Type className="size-4 text-muted-foreground" />
                      Title
                    </FieldLabel>
                    <span
                      className={
                        charsLeft < 0
                          ? "text-xs font-medium text-destructive"
                          : charsLeft < 10
                            ? "text-xs font-medium text-amber-500"
                            : "text-xs text-muted-foreground"
                      }
                    >
                      {charsLeft}
                    </span>
                  </div>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="An irresistible headline…"
                    className="glass h-12 border-0 text-base"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Content</FieldLabel>
                    <span className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{wordCount} words</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {readingTime} min read
                      </span>
                    </span>
                  </div>
                  <Textarea
                    aria-invalid={fieldState.invalid}
                    placeholder="Once upon a time…"
                    className="glass min-h-44 border-0 text-base leading-relaxed"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Media row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="flex items-center gap-1.5">
                      <ImagePlus className="size-4 text-muted-foreground" />
                      Cover image
                    </FieldLabel>
                    <label
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver("image");
                      }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={(e) => handleDrop("image", e, field.onChange)}
                      className={`glass relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed text-center transition-colors ${
                        dragOver === "image"
                          ? "scale-[1.02] border-primary bg-primary/5"
                          : "border-border/60 hover:border-primary/60"
                      }`}
                    >
                      {imagePreview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreview}
                            alt="Cover preview"
                            className="size-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setMediaFile("image", undefined, field.onChange);
                            }}
                            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-transform hover:scale-110"
                            aria-label="Remove image"
                          >
                            <X className="size-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 p-4 text-muted-foreground">
                          <ImagePlus className="size-7" />
                          <span className="text-sm font-medium">
                            {dragOver === "image"
                              ? "Drop it!"
                              : "Drop or click"}
                          </span>
                          <span className="text-xs">Up to 8 MB</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) =>
                          setMediaFile(
                            "image",
                            event.target.files?.[0],
                            field.onChange,
                          )
                        }
                      />
                    </label>
                    {field.value instanceof File && (
                      <p className="truncate text-xs text-muted-foreground">
                        {field.value.name} · {formatBytes(field.value.size)}
                      </p>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="video"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="flex items-center gap-1.5">
                      <Video className="size-4 text-muted-foreground" />
                      Video
                    </FieldLabel>
                    <label
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver("video");
                      }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={(e) => handleDrop("video", e, field.onChange)}
                      className={`glass relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed text-center transition-colors ${
                        dragOver === "video"
                          ? "scale-[1.02] border-primary bg-primary/5"
                          : "border-border/60 hover:border-primary/60"
                      }`}
                    >
                      {videoPreview ? (
                        <>
                          <video
                            src={videoPreview}
                            className="size-full object-cover"
                            muted
                            playsInline
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setMediaFile("video", undefined, field.onChange);
                            }}
                            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-transform hover:scale-110"
                            aria-label="Remove video"
                          >
                            <X className="size-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 p-4 text-muted-foreground">
                          <Video className="size-7" />
                          <span className="text-sm font-medium">
                            {dragOver === "video"
                              ? "Drop it!"
                              : "Drop or click"}
                          </span>
                          <span className="text-xs">Up to 100 MB</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        className="sr-only"
                        onChange={(event) =>
                          setMediaFile(
                            "video",
                            event.target.files?.[0],
                            field.onChange,
                          )
                        }
                      />
                    </label>
                    {field.value instanceof File && (
                      <p className="truncate text-xs text-muted-foreground">
                        {field.value.name} · {formatBytes(field.value.size)}
                      </p>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Add at least an image or a video ✨
            </p>

            <Button
              disabled={isPending}
              className="btn-glow h-12 w-full rounded-full text-base font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Publishing…</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Publish Post</span>
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        {/* Live preview */}
        <div className="create-reveal lg:sticky lg:top-24 lg:self-start">
          <div className="glass glass-sheen overflow-hidden rounded-3xl border-0">
            <div className="relative aspect-video w-full bg-muted/40">
              {videoPreview ? (
                <video
                  src={videoPreview}
                  className="size-full object-cover"
                  muted
                  playsInline
                />
              ) : imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImagePlus className="size-8" />
                  <span className="text-sm">Your media appears here</span>
                </div>
              )}
            </div>
            <div className="space-y-2 p-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                Live preview
              </span>
              <h3 className="text-lg font-bold leading-snug">
                {title || "Your title will shine here"}
              </h3>
              <p className="line-clamp-4 text-sm text-muted-foreground">
                {content || "Start writing and watch your post come to life…"}
              </p>
              {wordCount > 0 && (
                <span className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {readingTime} min read · {wordCount} words
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
