import z from "zod/v4"

// export type Todolist = {
//   id: string
//   title: string
//   addedDate: string
//   order: number
// }

// Schemas for API responses
export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.iso.datetime({ local: true }),
  order: z.int(),
})

// Types for API responses
export type Todolist = z.infer<typeof todolistSchema>

