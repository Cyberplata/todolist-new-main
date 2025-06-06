import { instance } from "@/common/instance"
import type { LoginResponse, LogoutResponse, MeResponse } from "@/features/auth/api/authApi.types.ts"
import type { LoginRequest } from "@/features/auth/lib/schemas"

export const authApi = {
  login(payload: LoginRequest) {
    return instance.post<LoginResponse>("/auth/login", payload)
  },
  logout() {
    return instance.delete<LogoutResponse>("/auth/login")
    // return instance.delete<BaseResponse>('auth/login')
  },
  me() {
    return instance.get<MeResponse>("/auth/me")
    // return instance.get<BaseResponse<{ id: number; email: string; login: string }>>('auth/me')
  },
}