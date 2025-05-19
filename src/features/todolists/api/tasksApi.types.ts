import { TaskPriority, TaskStatus } from "@/common/enums"
import { z } from "zod"

// export type DomainTask = {
//   description: string | null
//   title: string
//   status: TaskStatus
//   priority: TaskPriority
//   startDate: string | null
//   deadline: string | null
//   id: string
//   todoListId: string
//   order: number
//   addedDate: string
// }

export const DomainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  // startDate: z.nullable(z.string()).datetime({ local: true }),
  startDate: z.nullable(z.string().datetime({ local: true })),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.string(),
})

export type DomainTask = z.infer<typeof DomainTaskSchema>

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
}

export type UpdateTaskModel = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}
