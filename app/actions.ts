"use server";

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { updateTag } from "next/cache";
import { fetchIPv4 } from "@/lib/fetch-ipv4";

export async function createBlogAction(formData: FormData) {
  const values = {
    title: formData.get("title"),
    content: formData.get("content"),
    image: formData.get("image"),
  };
  try {
    console.log("[createBlogAction] 1. Parsing data...");
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      console.error("[createBlogAction] Invalid data:", parsed.error);
      throw new Error("Invalid form data");
    }

    console.log("[createBlogAction] 2. Getting token...");

    let token;
    try {
      token = await getToken();
      console.log("Token retrieved successfully");
    } catch (e) {
      console.error("Failed to get token:", e);
      return {
        error: "Authentication failed. Please try logging in again.",
      };
    }

    if (!token) {
      console.error("No token returned from getToken()");
      return {
        error: "Authentication token missing.",
      };
    }

    // Manual mutation to generate upload URL
    console.log("Generating upload URL...");
    const uploadUrlResponse = await fetchIPv4(
      `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          path: "posts:generateImageUploadUrl",
          args: {},
          format: "json",
        }),
      },
    );

    if (!uploadUrlResponse.ok) {
      const errorText = await uploadUrlResponse.text();
      console.error("Failed to generate upload URL:", errorText);
      return { error: "Failed to initialize image upload." };
    }

    const { value: imageUrl } = await uploadUrlResponse.json();
    console.log("Generated Upload URL:", imageUrl);

    const uploadResult = await fetchIPv4(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: Buffer.from(await parsed.data.image.arrayBuffer()),
    });

    console.log(
      "Upload Result Status:",
      uploadResult.status,
      uploadResult.statusText,
    );

    if (!uploadResult.ok) {
      const errorText = await uploadResult.text();
      console.error(
        "Image upload failed:",
        uploadResult.status,
        uploadResult.statusText,
        errorText,
      );
      return {
        error: `Failed to upload image: ${uploadResult.status} ${errorText}`,
      };
    }

    const { storageId } = await uploadResult.json();
    console.log("Upload successful, Storage ID:", storageId);

    // Manual mutation to create post
    console.log("Creating post...");
    const createPostResponse = await fetchIPv4(
      `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          path: "posts:createPost",
          args: {
            body: parsed.data.content,
            title: parsed.data.title,
            imageStorageId: storageId,
          },
          format: "json",
        }),
      },
    );

    if (!createPostResponse.ok) {
      const errorText = await createPostResponse.text();
      console.error("Failed to create post mutation:", errorText);
      return { error: "Failed to save blog post." };
    }

    console.log("Post created successfully in Convex");
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to create post",
    };
  }

  updateTag("blog");
  return redirect("/blog");
}
