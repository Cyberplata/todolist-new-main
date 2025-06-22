import { AUTH_TOKEN } from "@/common/constants"
import { instance } from "@/common/instance"
import type {
  ChangeTodolistTitle,
  CreateTodolists,
  DeleteTodolists,
  Todolist,
} from "@/features/todolists/api/todolistsApi.types.ts"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const todolistsApi = createApi({
  reducerPath: "todolistsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("API-KEY", import.meta.env.VITE_API_KEY)
      headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
    },
  }),
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),
    }),
  }),
})

export const { useGetTodolistsQuery } = todolistsApi

export const _todolistsApi = {
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
