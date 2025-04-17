import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { createSlice, nanoid } from "@reduxjs/toolkit"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((state, action) => {
      // var 1
      action.payload.todolists.forEach((tl) => {
        state.push({ ...tl, filter: "all" })
      })
      // var 2
      // return action.payload.todolists.map((tl) => {
      //   return {...tl, filter: 'all'}
      // })
    }),
    // var 1
    // createTodolistAC: create.preparedReducer(
    //   (title: string) => ({
    //     payload: {
    //       title,
    //       id: nanoid(),
    //     },
    //   }),
    //   (state, action) => {
    //     state.push({ ...action.payload, filter: 'all', addedDate: '', order: 0 })
    //   },
    // ),
    // var 2
    createTodolistAC: create.preparedReducer(
      (title: string) => {
        return {
          payload: {
            title,
            id: nanoid(),
          },
        }
      },
      (state, action) => {
        const newTodolists: DomainTodolist = {
          title: action.payload.title,
          id: action.payload.id,
          filter: "all",
          addedDate: "",
          order: 0,
        }
        state.push(newTodolists)
      },
    ),
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
  }),
})

export const { setTodolistsAC, deleteTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, createTodolistAC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
