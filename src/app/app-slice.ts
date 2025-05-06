import type { RequestStatus } from "@/common/types"
import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectAppError: (state) => state.error,
  },
  // reducers состоит из подредьюсеров, эквивалентных одному оператору case в switch
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      // логика в подредьюсерах мутабельная, а иммутабельность достигается благодаря immer.js
      state.themeMode = action.payload.themeMode
    }),
    setAppStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppErrorAC: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
  }),
})

// action creator достается из appSlice.actions
export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC } = appSlice.actions
// reducer достается из appSlice.reducer
export const appReducer = appSlice.reducer
export const { selectThemeMode, selectStatus, selectAppError } = appSlice.selectors

export type ThemeMode = "dark" | "light"
