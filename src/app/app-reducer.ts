import { createAction, createReducer } from "@reduxjs/toolkit"

export const changeThemeModeAC = createAction<{ themeMode: ThemeMode }>("app/changeThemeMode")

const initialState = {
  themeMode: 'light' as ThemeMode,
}

export const appReducer = createReducer(initialState, builder => {
  builder
    .addCase(changeThemeModeAC, (state, action) => {
      // логика мутабельного изменения стейта при изменении темы
      state.themeMode = action.payload.themeMode
    })
})

export type ThemeMode = 'dark' | 'light'