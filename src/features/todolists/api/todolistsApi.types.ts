import { baseResponseSchema } from "@/common/types"
import z from "zod"

// Schemas for API responses
export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.iso.datetime({ local: true }),
  order: z.int(),
})
export const getTodolistsSchema = z.array(todolistSchema)
export const createTodolistSchema = baseResponseSchema(z.object({ item: todolistSchema }))

// Types for API responses
export type Todolist = z.infer<typeof todolistSchema>
export type CreateTodolist = z.infer<typeof createTodolistSchema>

// export type DeleteTodolist = z.infer<typeof deleteTodolistSchema>
// export type ChangeTodolistTitle = z.infer<typeof changeTodolistTitleSchema>

// export const deleteTodolistSchema = baseResponseSchema(z.object({}))
// export const changeTodolistTitleSchema = baseResponseSchema(z.object({}))

// export type Todolist = {
//   id: string
//   title: string
//   addedDate: string
//   order: number
// }