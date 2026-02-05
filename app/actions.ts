// Updated actions.ts with better error handling
"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { redirect } from "next/navigation";
import { fetchAuthMutation } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      throw new Error("Invalid form data");
    }

    console.log("Calling fetchAuthMutation...");

    const result = await fetchAuthMutation(api.posts.createPost, {
      title: parsed.data.title,
      body: parsed.data.content,
    });

    console.log("Mutation successful:", result);

    return redirect("/");
  } catch (error) {
    console.error("Action error details:", error);

    if (error instanceof Error && error.message.includes("fetch")) {
      throw new Error(
        `Network error: ${error.message}. Check if Convex URL is correct: ${process.env.NEXT_PUBLIC_CONVEX_URL}`,
      );
    }

    throw error;
  }
}
