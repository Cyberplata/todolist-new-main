import { ResultCode } from "@/common/enums"

export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<T = {}> = {
  data: T
  fieldsErrors: FieldError[]
  messages: string[]
  resultCode: ResultCode
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
