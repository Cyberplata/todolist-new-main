import { instance } from "@/common/instance"
import type {
  ChangeTodolistTitle,
  CreateTodolists,
  DeleteTodolists,
  Todolist
} from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>("/todo-lists")
  },
  createTodolist(title: string) {
    // return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title })
    return instance.post<CreateTodolists>("todo-lists", { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<DeleteTodolists>(`/todo-lists/${id}`)
  },
  changeTodolistTitle(payload: { id: string; title: string }) {
    const { id, title } = payload
    return instance.put<ChangeTodolistTitle>(`/todo-lists/${id}`, { title })
  },
}
