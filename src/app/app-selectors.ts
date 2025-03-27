import type { ThemeMode } from "./app-reducer.ts"
import type { RootState } from "./store.ts"

export const selectThemeMode = (state: RootState): ThemeMode => state.app.themeMode