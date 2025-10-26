import { instance } from "@/common/instance"
import type {
  CreateTodolist,
  DefaultResponse,
  Todolist,
} from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>("/todo-lists")
  },
  createTodolist(title: string) {
    // return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title })
    return instance.post<CreateTodolist>("todo-lists", { title })
  },
  deleteTodolist(id: string) {
    // return instance.delete<BaseResponse>(`/todo-lists/${id}`)
    return instance.delete<DefaultResponse>(`/todo-lists/${id}`)
  },
  changeTodolistTitle(payload: { id: string; title: string }) {
    const { id, title } = payload
    // return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
    return instance.put<DefaultResponse>(`/todo-lists/${id}`, { title })
  },
}
