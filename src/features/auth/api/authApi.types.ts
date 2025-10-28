import { baseResponseSchema } from "@/common/types"
import z from "zod"

// login
export const loginResponseSchema = baseResponseSchema(
  z.object({
    userId: z.number(),
    token: z.string(),
  }),
)

export type LoginResponse = z.infer<typeof loginResponseSchema>
