import { ResultCode } from "@/common/enums"
import { TodolistSchema } from "@/features/todolists/api/todolistsApi.types.ts"
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

export const CreateTodolistsBaseResponseSchema = BaseResponseSchema(
  z.object({ item: TodolistSchema })
)
export const DeleteTodolistResponseSchema = BaseResponseSchema(z.object({}))
export const ChangeTodolistTitleResponseSchema = BaseResponseSchema(z.object({ item: TodolistSchema }))

export type CreateBaseResponse = z.infer<typeof CreateTodolistsBaseResponseSchema>
export type DeleteBaseResponse = z.infer<typeof DeleteTodolistResponseSchema>
export type ChangeTodolistTitleBaseResponse = z.infer<typeof ChangeTodolistTitleResponseSchema>

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
