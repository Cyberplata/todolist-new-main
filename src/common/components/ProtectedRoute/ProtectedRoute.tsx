import { Path } from "@/common/routing"
import type { PropsWithChildren } from "react"
import { Navigate, Outlet } from "react-router"

// Проблематика: если появляются новые компоненты, допустим News, то нужно снова копировать код if(!isLoggedIn) return <Navigate to={Path.Login}/> из ProtectedRoute (компонент Main) и везде доставать селектором isLoggedIn и проверять если не залогинен, то перекидывать на страницу логина. А если добавиться ещё страница Profile, то снова копировать код. То есть обернули компонент Main в ProtectedRoute, так как мы не хотим, чтобы пользователь видел страницу, если он не залогинен.
// И вот для этого и нужен ProtectedRoute. 👌👌👌

type Props = {
  isAllowed: boolean
  // children?: ReactNode // var1 с явным типом
}

// var1 с явным типом
// export const ProtectedRoute = ({ children, isAllowed }: Props) => {
// var2 с неявным типом PropsWithChildren
export const ProtectedRoute = ({ children, isAllowed }: PropsWithChildren<Props>) => {
  if (!isAllowed) {
    return <Navigate to={Path.Login} />
  }

  return children ? children : <Outlet />
}
