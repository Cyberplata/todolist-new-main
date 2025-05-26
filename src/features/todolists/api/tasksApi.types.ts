import { TaskPriority, TaskStatus } from "@/common/enums"
import { BaseResponseSchema } from "@/common/types"
import { z } from "zod"

export const DomainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  startDate: z.nullable(z.string().datetime({ local: true })),
  // startDate: z.nullable(z.string()),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.string().datetime({ local: true }),
})
export const CreateTasksSchema = BaseResponseSchema(z.object({ item: DomainTaskSchema }))
export const UpdateTaskSchema = BaseResponseSchema(z.object({ item: DomainTaskSchema }))
export const DeleteTaskSchema = BaseResponseSchema(z.object({}))
export const GetTasksResponseSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number(),
  items: z.array(DomainTaskSchema),
})
export const UpdateTaskModelSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
})

export type DomainTask = z.infer<typeof DomainTaskSchema>
export type CreateTasks = z.infer<typeof CreateTasksSchema>
export type UpdateTasks = z.infer<typeof UpdateTaskSchema>
export type DeleteTasks = z.infer<typeof DeleteTaskSchema>
export type GetTasksResponse = z.infer<typeof GetTasksResponseSchema>
export type UpdateTaskModel = z.infer<typeof UpdateTaskModelSchema>

// export type _GetTasksResponse = {
//   error: Nullable<string>
//   totalCount: number
//   items: DomainTask[]
// }

// export type _UpdateTaskModel = {
//   // description: string | null
//   description: Nullable<string>
//   title: string
//   status: TaskStatus
//   priority: TaskPriority
//   startDate: Nullable<string>
//   deadline: Nullable<string>
// }