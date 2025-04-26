import { setAppStatusAC } from "@/app/app-slice.ts"
import { createAppSlice } from "@/common/utils"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolists: res.data }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((tl) => {
            state.push({ ...tl, filter: "all" })
          })
        },
        rejected: (_state, _action) => {
          // обработка ошибки при запросе за тудулистами
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: string, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          const newTodo = res.data.data.item
          return { todolist: newTodo }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTodolists: DomainTodolist = {
            ...action.payload.todolist,
            filter: "all",
          }
          state.unshift(newTodolists)
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (payload: { id: string }, thunkAPI) => {
        const { id } = payload
        const { rejectWithValue } = thunkAPI
        try {
          await todolistsApi.deleteTodolist(id)
          return { id }
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(changeTodolistTitleTC.rejected, (_state, _action) => {
        // обработка ошибки при запросе на смену имени тудулиста
      })
  },
})

// Thunks creators
// export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_, thunkAPI) => {
//   const { rejectWithValue } = thunkAPI
//   try {
//     const res = await todolistsApi.getTodolists()
//     return { todolists: res.data }
//   } catch (error) {
//     return rejectWithValue(null)
//   }
// })

// export const createTodolistTC = createAsyncThunk(
//   `${todolistsSlice.name}/createTodolistTC`,
//   async (title: string, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI
//     try {
//       const res = await todolistsApi.createTodolist(title)
//       const newTodo = res.data.data.item
//       return { todolist: newTodo }
//       // dispatch(createTodolistAC({ todolist: newTodo }))
//     } catch (error) {
//       return rejectWithValue(null)
//     }
//   },
// )

// export const deleteTodolistTC = createAsyncThunk(
//   `${todolistsSlice.name}/deleteTodolistTC`,
//   async (payload: { id: string }, thunkAPI) => {
//     const { id } = payload
//     const { rejectWithValue } = thunkAPI
//     try {
//       await todolistsApi.deleteTodolist(id)
//       return { id }
//     } catch (error) {
//       return rejectWithValue(null)
//     }
//   },
// )

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (
    payload: {
      id: string
      title: string
    },
    thunkAPI,
  ) => {
    const { rejectWithValue } = thunkAPI
    try {
      await todolistsApi.changeTodolistTitle(payload)
      return payload
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const { fetchTodolistsTC, createTodolistTC, deleteTodolistTC, changeTodolistFilterAC } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
