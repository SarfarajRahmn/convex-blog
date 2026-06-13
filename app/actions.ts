"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { updateTag } from "next/cache";

type UploadToken = Awaited<ReturnType<typeof getToken>>;

/** Upload a single file to Convex storage and return its storageId. */
async function uploadFile(
  file: File,
  token: UploadToken,
): Promise<Id<"_storage">> {
  const uploadUrl = await fetchMutation(
    api.posts.generateImageUploadUrl,
    {},
    { token },
  );

  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!result.ok) {
    throw new Error("Upload failed");
  }

  const { storageId } = await result.json();
  return storageId as Id<"_storage">;
}

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      return { error: "Please check the form and try again" };
    }

    const { image, video, title, content } = parsed.data;

    if (!image && !video) {
      return { error: "Please add an image or a video" };
    }

    const token = await getToken();

    const imageStorageId = image ? await uploadFile(image, token) : undefined;
    const videoStorageId = video ? await uploadFile(video, token) : undefined;

    await fetchMutation(
      api.posts.createPost,
      {
        body: content,
        title,
        imageStorageId,
        videoStorageId,
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
