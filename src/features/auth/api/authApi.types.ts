import { BaseResponseSchema } from "@/common/types"
import { z } from "zod"

// Schemas for API responses
export const LoginSchema = BaseResponseSchema(z.object({
  userId: z.number(),
  token: z.string(),
}))
export const LogoutSchema = BaseResponseSchema(z.object({}))

// Response type for login API
export type LoginResponse = z.infer<typeof LoginSchema>
export type LogoutResponse = z.infer<typeof LogoutSchema>