import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email(),
  password: z.string(),
  rememberMe: z.boolean(),
})

export type Inputs = z.infer<typeof loginSchema>