import { Path } from "@/common/routing"
import type { ReactNode } from "react"
import { Navigate } from "react-router"

type Props = {
  children: ReactNode
  isAllowed: boolean
}

export const ProtectedRoute = ({ children, isAllowed }: Props) => {
  if (!isAllowed) {
    return <Navigate to={Path.Login} />
  }
  return children
}
