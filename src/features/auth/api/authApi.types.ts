import { BaseResponseSchema } from "@/common/types"
import { z } from "zod"

export const LoginSchema = BaseResponseSchema(z.object({
  userId: z.number(),
  token: z.string(),
}))

// Response type for login API
export type Login = z.infer<typeof LoginSchema>