import { setAppStatusAC } from "@/app/app-slice.ts"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { authApi } from "@/features/auth/api/authApi.ts"
import { LoginSchema, LogoutSchema, MeSchema } from "@/features/auth/api/authApi.types.ts"
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
          const parsedRes = LoginSchema.parse(res.data)
          if (parsedRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            // localStorage.setItem(AUTH_TOKEN, res.data.data.token)
            localStorage.setItem(AUTH_TOKEN, parsedRes.data.token)
            return { isLoggedIn: true }
          } else {
            handleServerAppError(parsedRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
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
          const parsedRes = LogoutSchema.parse(res.data)
          if (parsedRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            localStorage.removeItem(AUTH_TOKEN)
            return { isLoggedIn: false }
          } else {
            handleServerAppError(parsedRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
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
      async (_, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.me()
          const parsedRes = MeSchema.parse(res.data)
          if (parsedRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { isLoggedIn: true }
          } else {
            handleServerAppError(parsedRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
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

    // initializeAppTC: create.asyncThunk(
    //   async (_, { dispatch, rejectWithValue }) => {
    //     try {
    //       dispatch(setAppStatusAC({ status: 'loading' }))
    //       const res = await authApi.me()
    //       if (res.data.resultCode === ResultCode.Success) {
    //         dispatch(setAppStatusAC({ status: 'succeeded' }))
    //         return { isLoggedIn: true }
    //       } else {
    //         handleServerAppError(res.data, dispatch)
    //         return rejectWithValue(null)
    //       }
    //     } catch (error: any) {
    //       handleServerNetworkError(error, dispatch)
    //       return rejectWithValue(null)
    //     }
    //   },
    //   {
    //     fulfilled: (state, action) => {
    //       state.isLoggedIn = action.payload.isLoggedIn
    //     },
    //   }
    // ),
  }),
})

export const { selectIsLoggedIn } = authSlice.selectors
export const { loginTC, logoutTC, initializeAppTC } = authSlice.actions
export const authReducer = authSlice.reducer
