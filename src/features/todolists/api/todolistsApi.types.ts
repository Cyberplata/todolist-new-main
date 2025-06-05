import { BaseResponseSchema } from "@/common/types"
import { z } from "zod"

// Schemas for API responses
export const TodolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.string().datetime({ local: true }),
  order: z.number(),
})
// export const TodolistSchema = z.object({
//   id: z.string().optional(),
//   title: z.string().optional(),
//   addedDate: z.string().datetime({ local: true }).optional(),
//   order: z.number().optional(),
// }).refine(data => data.id && data.title, {
//   message: "ID and title are required for valid todolist"
// })
export const CreateTodolistsSchema = BaseResponseSchema(z.object({ item: TodolistSchema }))
export const DeleteTodolistSchema = BaseResponseSchema(z.object({}))
export const ChangeTodolistTitleSchema = BaseResponseSchema(z.object({}))

// Types for API responses
export type Todolist = z.infer<typeof TodolistSchema>
export type CreateTodolists = z.infer<typeof CreateTodolistsSchema>
export type DeleteTodolists = z.infer<typeof DeleteTodolistSchema>
export type ChangeTodolistTitle = z.infer<typeof ChangeTodolistTitleSchema>

// ----------------OLD👴👴👴------------------
// export type Todolist = {
//   id: string
//   title: string
//   addedDate: string
//   order: number
// }