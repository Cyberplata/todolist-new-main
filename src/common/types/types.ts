import { ResultCode } from "@/common/enums"
import { z } from "zod"

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
    resultCode: z.nativeEnum(ResultCode),
  })

export type BaseResponse<T = {}> = { //
  data: T
  fieldsErrors: z.infer<typeof FieldErrorSchema>[]
  messages: string[]
  resultCode: ResultCode
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

// ------------------------OLD------------------------👴👴👴
// export type FieldError = {
//   error: string
//   field: string
// }
//
// export type BaseResponse<T = {}> = { //
//   data: T
//   fieldsErrors: FieldError[]
//   messages: string[]
//   resultCode: ResultCode
// }

// Вариант 2 (с дефолтным значением)
// А если прям очень хочешь дефолтное значение, то правильнее написать вот так:
// export const BaseResponseSchema = (
//   dataSchema: z.ZodTypeAny = z.object({})
// ) =>
//   z.object({
//     data: dataSchema,
//     fieldsErrors: z.array(FieldErrorSchema),
//     messages: z.array(z.string()),
//     resultCode: z.nativeEnum(ResultCode),
//   })
