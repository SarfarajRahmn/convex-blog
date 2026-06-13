import z from "zod";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must be at most 50 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_BYTES, "Image must be under 8 MB")
    .refine((file) => file.type.startsWith("image/"), "File must be an image")
    .optional(),
  video: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_VIDEO_BYTES,
      "Video must be under 100 MB",
    )
    .refine((file) => file.type.startsWith("video/"), "File must be a video")
    .optional(),
});
