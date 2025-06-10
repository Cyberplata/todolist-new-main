import { Main } from "@/app/Main"
import { Faq } from "@/common/components/Faq"
import { PageNotFound } from "@/common/components/PageNotFound"
import { ProtectedRoute } from "@/common/components/ProtectedRoute/ProtectedRoute.tsx"
import { useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"
import { Login } from "@/features/auth/ui/Login/Login.tsx"
import { Route, Routes } from "react-router"

export const Path = {
  Main: "/",
  Login: "/login",
  Faq: '/faq',
  NotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)


  return (
    <Routes>
      {/*1ый вариант через копирование кода*/}
      {/*<Route*/}
      {/*  path={Path.Main}*/}
      {/*  element={*/}
      {/*    <ProtectedRoute isAllowed={isLoggedIn}>*/}
      {/*      <Main />*/}
      {/*    </ProtectedRoute>*/}
      {/*  }*/}
      {/*/>*/}
      {/*<Route*/}
      {/*  path={Path.Faq}*/}
      {/*  element={*/}
      {/*    <ProtectedRoute isAllowed={isLoggedIn}>*/}
      {/*      <Faq />*/}
      {/*    </ProtectedRoute>*/}
      {/*  }*/}
      {/*/>*/}

      {/*2ой вариант через Nested Routes*/}
      <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
        <Route path={Path.Main} element={<Main />} />
        <Route path={Path.Faq} element={<Faq />} />
      </Route>

      <Route path={Path.Login} element={<Login />} />
      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
