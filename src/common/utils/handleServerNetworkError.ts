import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice.ts"
import type { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"

export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage
  if (axios.isAxiosError(error)) {
    // обработка ошибок сервера, когда ломаем наш instance 403 (token) и 401(api-key)
    errorMessage = error.response?.data?.message || error.message
  } else if (error instanceof Error) {
    errorMessage = `Native error: ${error.message}`
  } else {
    errorMessage = JSON.stringify(error)
  }

  dispatch(setAppErrorAC({ error: errorMessage }))
  dispatch(setAppStatusAC({ status: "failed" }))
}
