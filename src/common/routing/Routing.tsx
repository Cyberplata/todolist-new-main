import { Main } from "@/app/Main"
import { PageNotFound } from "@/common/components/PageNotFound"
import { Login } from "@/features/auth/ui/Login/Login.tsx"
import { Route, Routes } from "react-router"

export const Path = {
  Main: '/',
  Login: '/login',
  NotFound: '*',
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
    <Route path={Path.Login} element={<Login />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)