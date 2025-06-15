
import { z } from "zod";

// Validation schemas
export const milestoneSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  due_date: z.string().optional(), // Ideally validate date but keep loose for now
});

export const taskSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  deadline: z.string().optional(),
  status: z.enum(["todo", "in-progress", "completed"]),
});

export const fileSchema = z.object({
  filename: z.string().min(2).max(100),
  url: z.string().url(),
  description: z.string().max(500).optional(),
});

export const threadSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string().max(1000).optional(),
});

// Optional: strip HTML tags as basic sanitization
export function sanitize(input: string = "") {
  return input.replace(/<[^>]*>/g, "");
}
