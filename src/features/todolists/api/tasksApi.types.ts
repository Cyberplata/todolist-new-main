import { TaskPriority, TaskStatus } from "@/common/enums"
import { z } from "zod/v4"

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
  // addedDate: z.string(),
})
export const getTasksResponseSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number(),
  items: z.array(domainTaskSchema),
})

// Types for API responses
export type DomainTask = z.infer<typeof domainTaskSchema>
export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>

export type UpdateTaskModel = {
  description: string | null
  startDate: string | null
  deadline: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
}


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

// export type GetTasksResponse = {
//   error: string | null
//   totalCount: number
//   items: DomainTask[]
// }