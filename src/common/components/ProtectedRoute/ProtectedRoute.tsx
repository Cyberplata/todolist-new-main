import { Path } from "@/common/routing"
import type { ReactNode } from "react"
import { Navigate } from "react-router"

// Проблематика: если появляются новые компоненты, допустим News, то нужно снова копировать код if(!isLoggedIn) return <Navigate to={Path.Login}/> из ProtectedRoute (компонент Main) и везде доставать селектором isLoggedIn и проверять если не залогинен, то перекидывать на страницу логина. А если добавиться ещё страница Profile, то снова копировать код. То есть обернули компонент Main в ProtectedRoute, так как мы не хотим, чтобы пользователь видел страницу, если он не залогинен.
// И вот для этого и нужен ProtectedRoute. 👌👌👌

type Props = {
  children: ReactNode
  isAllowed: boolean
}

export const ProtectedRoute = ({ children, isAllowed }: Props) => {
  // const isLoggedIn = useAppSelector(selectIsLoggedIn)

  if (!isAllowed) {
    return <Navigate to={Path.Login} />
  }

  return children
}
