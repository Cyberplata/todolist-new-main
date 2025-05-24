import { instance } from "@/common/instance"
// import type { BaseResponse } from "@/common/types"
import type { ChangeTodolistTitleBaseResponse, CreateBaseResponse, DeleteBaseResponse } from "@/common/types/types.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>("/todo-lists")
  },
  createTodolist(title: string) {
    // return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title })
    return instance.post<CreateBaseResponse>("todo-lists", { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<DeleteBaseResponse>(`/todo-lists/${id}`)
  },
  changeTodolistTitle(payload: { id: string; title: string }) {
    const { id, title } = payload
    return instance.put<ChangeTodolistTitleBaseResponse>(`/todo-lists/${id}`, { title })
  },
}
