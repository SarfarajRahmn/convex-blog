"use server";

import z from "zod";
import { createPostInputSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { updateTag } from "next/cache";

export async function createBlogAction(
  values: z.infer<typeof createPostInputSchema>,
) {
  try {
    const parsed = createPostInputSchema.safeParse(values);

    if (!parsed.success) {
      return { error: "Please check the form and try again" };
    }

    const { title, content, imageStorageId, videoStorageId } = parsed.data;

    if (!imageStorageId && !videoStorageId) {
      return { error: "Please add an image or a video" };
    }

    const token = await getToken();

    await fetchMutation(
      api.posts.createPost,
      {
        body: content,
        title,
        imageStorageId: imageStorageId as Id<"_storage"> | undefined,
        videoStorageId: videoStorageId as Id<"_storage"> | undefined,
      },
      { token },
    );
  } catch {
    return {
      error: "Failed to create post",
    };
  }

  updateTag("blog");
  return redirect("/blog");
}
