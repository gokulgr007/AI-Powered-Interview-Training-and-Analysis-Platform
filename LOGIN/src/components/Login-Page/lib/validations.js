import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertUserSchema = z.object({
  email: z.string().email("Invalid email"),
  fullName: z.string().min(1, "Full name required"),
  role: z.string().min(1),
  experienceLevel: z.string().min(1),
  password: z.string().min(8, "Password too short"),
});

export default { loginSchema, insertUserSchema };
