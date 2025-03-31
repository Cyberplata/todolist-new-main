import "./App.css"
import { Main } from "@/app/Main.tsx"
import { Header } from "@/common/components/Header/Header.tsx"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useAppSelector } from "../common/hooks/useAppSelector"
import { getTheme } from "../common/theme/theme.ts"
import { selectThemeMode } from "./app-selectors.ts"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        <Main />
      </div>
    </ThemeProvider>
  )
}
