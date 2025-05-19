import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice.ts"
import type { Dispatch } from "@reduxjs/toolkit"
import axios, { type AxiosError } from "axios"
import { z } from "zod"

// pattern matching engine 🤓🤓🤓 Variant I - GPT ✅✅✅
// 📌 Универсальный обработчик ошибок.
// Использует массив с { predicate, handler }, где:
// - predicate: проверяет тип ошибки (например, AxiosError, ZodError, Error).
// - handler: возвращает строку с сообщением об ошибке.
// Для AxiosError приводим тип к AxiosError<{ message?: string }>, чтобы TypeScript знал о наличии поля message в response.data.
// Решает проблему TS2339 (Property 'message' does not exist on type '{}')

type ErrorHandlerEntry = {
  predicate: (error: unknown) => boolean
  handler: (error: unknown) => string
}

export const handleServerNetworkError = (dispatch: Dispatch, error: unknown) => {
  const handlers: ErrorHandlerEntry[] = [
    {
      predicate: (e): e is AxiosError => axios.isAxiosError(e),
      handler: (e) => {
        const err = e as AxiosError<{ message?: string }>
        return err.response?.data?.message || err.message
      },
    },
    {
      predicate: (e): e is z.ZodError => e instanceof z.ZodError,
      handler: (e) => {
        const err = e as z.ZodError
        console.table(err.issues)
        return 'Zod error. Смотри консоль'
      },
    },
    {
      predicate: (e): e is Error => e instanceof Error,
      handler: (e) => {
        const err = e as Error
        return `Native error: ${err.message}`
      },
    },
  ]

  const found = handlers.find(({ predicate }) => predicate(error))

  const errorMessage = found
    ? found.handler(error)
    : JSON.stringify(error)

  dispatch(setAppErrorAC({ error: errorMessage }))
  dispatch(setAppStatusAC({ status: 'failed' }))
}

// Variant II ✅✅✅
// export const handleServerNetworkError = (dispatch: Dispatch, error: unknown) => {
//   let errorMessage
//
//   switch (true) {
//     case axios.isAxiosError(error):
//       errorMessage = error.response?.data?.message || error.message
//       break
//
//     case error instanceof z.ZodError:
//       console.table(error.issues)
//       errorMessage = 'Zod error. Смотри консоль'
//       break
//
//     case error instanceof Error:
//       errorMessage = `Native error: ${error.message}`
//       break
//
//     default:
//       errorMessage = JSON.stringify(error)
//   }
//
//   dispatch(setAppErrorAC({ error: errorMessage }))
//   dispatch(setAppStatusAC({ status: 'failed' }))
// }