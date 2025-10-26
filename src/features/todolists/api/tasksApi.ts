import { instance } from "@/common/instance"
import type {
  DeleteTasks,
  GetTasksResponse,
  TaskOperationResponse,
  UpdateTaskModel,
} from "@/features/todolists/api/tasksApi.types.ts"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { todolistId: string; title: string }) {
    const { todolistId, title } = payload
    return instance.post<TaskOperationResponse>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  // updateTask(payload: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
  updateTask(payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> }) {
    const { todolistId, taskId, domainModel } = payload
    return instance.put<TaskOperationResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`, domainModel)
  },
  deleteTask(payload: { todolistId: string; taskId: string }) {
    const { todolistId, taskId } = payload
    return instance.delete<DeleteTasks>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}
