import { ResultCode } from "@/common/enums"
import z from "zod"

// Обычная FieldError схема
export const fieldErrorSchema = z.object({
  error: z.string(),
  field: z.string(),
})

type FieldError = z.infer<typeof fieldErrorSchema>

export const baseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    fieldsErrors: z.array(fieldErrorSchema),
    messages: z.array(z.string()),
    resultCode: z.enum(ResultCode),
  })

export type BaseResponse<T = {}> = { //
  data: T
  // fieldsErrors: z.infer<typeof FieldErrorSchema>[]
  fieldsErrors: FieldError[]
  messages: string[]
  resultCode: ResultCode
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

// export type FieldError = {
//   error: string
//   field: string
// }
//
// export type BaseResponse<T = {}> = {
//   data: T
//   fieldsErrors: FieldError[]
//   messages: string[]
//   resultCode: number
// }