import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import type { LoginRequest } from "@/features/auth/lib/schemas"

export const authApi = {
  login(payload: LoginRequest) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>('auth/login', payload)
  },
}