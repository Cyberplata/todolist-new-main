import { BaseResponseSchema } from "@/common/types"
import { z } from "zod"

// Schemas for API responses
export const LoginSchema = BaseResponseSchema(
  z.object({
    userId: z.number(),
    token: z.string(),
  }),
)
export const LogoutSchema = BaseResponseSchema(z.object({}))
export const MeDataSchema = z.object({
  id: z.number(),
  email: z.string(),
  login: z.string(),
})
export const MeSchema = BaseResponseSchema(MeDataSchema)

// Response type for login API
export type LoginResponse = z.infer<typeof LoginSchema>
export type LogoutResponse = z.infer<typeof LogoutSchema>
export type MeResponse = z.infer<typeof MeSchema>
