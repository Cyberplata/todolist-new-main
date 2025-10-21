import { ResultCode } from "@/common/enums"
import z from "zod/v4"

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


// Обычная FieldError схема
export const FieldErrorSchema = z.object({
  error: z.string(),
  field: z.string(),
})

// Функция, возвращающая BaseResponseSchema с generic'ом для data
// Вариант 1 (самый честный) — сделать функцию перегружаемой:
export const BaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    fieldsErrors: z.array(FieldErrorSchema),
    messages: z.array(z.string()),
    resultCode: z.enum(ResultCode),
  })

export type BaseResponse<T = {}> = { //
  data: T
  fieldsErrors: z.infer<typeof FieldErrorSchema>[]
  messages: string[]
  resultCode: ResultCode
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"
