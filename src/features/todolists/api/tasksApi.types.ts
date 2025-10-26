import { TaskPriority, TaskStatus } from "@/common/enums"
import { baseResponseSchema } from "@/common/types"
import z from "zod"

// Schemas for API responses
export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  title: z.string(),
  id: z.string(),
  todoListId: z.string(),
  order: z.int(),
  addedDate: z.iso.datetime({ local: true }),
})
export const getTasksResponseSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number().int().nonnegative(),
  items: z.array(domainTaskSchema),
})
// Create and update task
export const taskOperationResponseSchema = baseResponseSchema(z.object({ item: domainTaskSchema }))
export const updateTaskModelSchema = z.object({
  description: z.string().nullable(),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
})

// Types for API responses
export type DomainTask = z.infer<typeof domainTaskSchema>
export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>
export type TaskOperationResponse = z.infer<typeof taskOperationResponseSchema>
export type UpdateTaskModel = z.infer<typeof updateTaskModelSchema>

// export const createTasksSchema = BaseResponseSchema(z.object({ item: domainTaskSchema }))
// export const updateTaskSchema = BaseResponseSchema(z.object({ item: domainTaskSchema }))
// export const deleteTaskSchema = baseResponseSchema(z.object({}))
// export type CreateTasks = z.infer<typeof createTasksSchema>
// export type UpdateTasks = z.infer<typeof updateTaskSchema>
// export type DeleteTasks = z.infer<typeof deleteTaskSchema>

// export type DomainTask = {
//   description: string
//   title: string
//   status: TaskStatus
//   priority: TaskPriority
//   startDate: string
//   deadline: string
//   id: string
//   todoListId: string
//   order: number
//   addedDate: string
// }
//
// export type GetTasksResponse = {
//   error: string | null
//   totalCount: number
//   items: DomainTask[]
// }
//
// export type UpdateTaskModel = {
//   description: string | null
//   startDate: string | null
//   deadline: string | null
//   title: string
//   status: TaskStatus
//   priority: TaskPriority
// }