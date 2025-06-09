import { selectThemeMode } from "@/app/app-slice.ts"
import { ErrorSnackbar } from "@/common/components/ErrorSnackbar"
import { Header } from "@/common/components/Header/Header"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Routing } from "@/common/routing"
import { getTheme } from "@/common/theme"
import { initializeAppTC } from "@/features/auth/model/auth-slice.ts"
import CircularProgress from "@mui/material/CircularProgress"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useEffect, useState } from "react"
import styles from "./App.module.css"

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Отключаем крутилку, если приложение уже проинициализировано
    dispatch(initializeAppTC()).finally(() => setIsInitialized(true))
  }, [])

  // Ранее прерывание, чтобы не рендерить компоненты, которые еще не загрузились
  if (!isInitialized) {
    return (
      <div className={styles.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
