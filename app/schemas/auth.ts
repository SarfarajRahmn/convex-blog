import z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(30),
  email: z.email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20),
});
