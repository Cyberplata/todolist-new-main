import { setAppStatusAC } from "@/app/app-slice.ts"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { defaultResponseSchema } from "@/common/types"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { authApi } from "@/features/auth/api/authApi.ts"
import { loginResponseSchema, meResponseSchema } from "@/features/auth/api/authApi.types.ts"
import type { LoginRequest } from "@/features/auth/lib/schemas"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    loginTC: create.asyncThunk(
      async (data: LoginRequest, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.login(data)
          const parseRes = loginResponseSchema.parse(res.data) // 💎 ZOD
          localStorage.setItem(AUTH_TOKEN, parseRes.data.token)
          if (parseRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { isLoggedIn: true }
          } else {
            handleServerAppError(parseRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    logoutTC: create.asyncThunk(
      async (_, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI

        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.logout()
          const parseRes = defaultResponseSchema.parse(res.data) // 💎 ZOD
          localStorage.removeItem(AUTH_TOKEN)
          if (parseRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { isLoggedIn: false }
          } else {
            handleServerAppError(parseRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    initializeAppTC: create.asyncThunk(
      async (_arg, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.me()
          const parseRes = meResponseSchema.parse(res.data) // 💎 ZOD
          if (parseRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { isLoggedIn: true }
          } else {
            handleServerAppError(parseRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
  }),
})

export const { loginTC, logoutTC, initializeAppTC } = authSlice.actions
export const authReducer = authSlice.reducer
export const { selectIsLoggedIn } = authSlice.selectors
