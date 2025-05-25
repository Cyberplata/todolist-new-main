import { z } from "zod"

export const safeParse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  debugger
  const result = schema.safeParse(data)
  if (!result.success) {
    console.error("Invalid API response", result.error)
    throw new Error("Invalid API response")
  }
  return result.data
}

//  Что тут происходит: 🔘
// safeParse = <T>(schema: z.ZodType<T>, data: unknown): T => {
// <T> — это generic-параметр, чтобы мы могли типизировать возвращаемое значение.
//
// schema: z.ZodType<T> — аргумент функции, это Zod-схема (конкретный валидатор), например твой ChangeTodolistTitleResponseSchema.
//
// data: unknown — данные, которые мы валидируем. Тип unknown специально, чтобы заставить валидировать всё, что пришло.

// const result = schema.safeParse(data) 🈳
// Вот тут самое важное:
//
// safeParse — это метод из библиотеки Zod, который вызывается у схемы.
//
// Он принимает данные, валидирует их и возвращает объект вида:
// type SafeParseReturnType<T> =
//   | { success: true; data: T }
//   | { success: false; error: ZodError }
// То есть два возможных варианта:
//
// Если валидация прошла успешно → success: true и данные в data
//
// Если ошибка → success: false и ошибка в error (типа ZodError)