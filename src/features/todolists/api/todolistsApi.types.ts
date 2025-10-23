import { BaseResponseSchema } from "@/common/types"
import z from "zod/v4"

// Schemas for API responses
export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.iso.datetime({ local: true }),
  order: z.int(),
})
export const createTodolistsSchema = BaseResponseSchema(z.object({ item: todolistSchema }))
export const deleteTodolistSchema = BaseResponseSchema(z.object({}))
export const changeTodolistTitleSchema = BaseResponseSchema(z.object({}))

// Types for API responses
export type Todolist = z.infer<typeof todolistSchema>
export type CreateTodolists = z.infer<typeof createTodolistsSchema>
export type DeleteTodolists = z.infer<typeof deleteTodolistSchema>
export type ChangeTodolistTitle = z.infer<typeof changeTodolistTitleSchema>

// export type Todolist = {
//   id: string
//   title: string
//   addedDate: string
//   order: number
// }