import { instance } from "@/common/instance"
import type { DefaultResponse } from "@/common/types"
import type { LoginResponse } from "@/features/auth/api/authApi.types.ts"
import type { LoginRequest } from "@/features/auth/lib/schemas"

export const authApi = {
  login(payload: LoginRequest) {
    // return instance.post<BaseResponse<{ userId: number; token: string }>>('auth/login', payload)
    return instance.post<LoginResponse>("auth/login", payload)
  },
  logout() {
    return instance.delete<DefaultResponse>(`/auth/login/`)
  },
}