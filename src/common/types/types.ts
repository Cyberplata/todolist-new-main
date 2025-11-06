import { ResultCode } from "@/common/enums"
import z from "zod"

// Schemas for API responses
export const fieldErrorSchema = z.object({
  error: z.string(),
  field: z.string(),
})
export const baseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    fieldsErrors: z.array(fieldErrorSchema),
    messages: z.array(z.string()),
    resultCode: z.enum(ResultCode),
  })
export const defaultResponseSchema = baseResponseSchema(z.object({}))

// Types for API responses
type FieldError = z.infer<typeof fieldErrorSchema>
export type BaseResponse<T = {}> = {
  data: T
  fieldsErrors: FieldError[]
  messages: string[]
  resultCode: ResultCode
}
// deleteTask + deleteTodolist + changeTodolistTitle + logout
export type DefaultResponse = z.infer<typeof defaultResponseSchema>

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