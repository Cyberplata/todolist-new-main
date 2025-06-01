import { instance } from "@/common/instance"
import type { Login } from "@/features/auth/api/authApi.types.ts"
import type { LoginInputs } from "@/features/auth/lib/schemas"

export const authApi = {
  login(payload: LoginInputs) {
    return instance.post<Login>("/auth/login", payload)
  },
}