import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload?.todolists.forEach((tl) => {
          state.push({ ...tl, filter: "all" })
        })
      })
      .addCase(fetchTodolistsTC.rejected, (_state, _action) => {
        // обработка ошибки при запросе за тудулистами
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(changeTodolistTitleTC.rejected, (_state, _action) => {
        // обработка ошибки при запросе на смену имени тудулиста
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        const newTodolists: DomainTodolist = {
          // title: action.payload.title,
          // id: action.payload.id,
          // filter: "all",
          // addedDate: "",
          // order: 0,
          ...action.payload.todolist,
          filter: "all",
        }
        state.push(newTodolists)
      })
      .addCase(createTodolistTC.rejected, (_state, _action) => {
        // обработка ошибки при создании тудулиста
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(deleteTodolistTC.rejected, (_state, _action) => {
        // обработка ошибки при создании тудулиста
      })
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})

// Thunks creators
export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const res = await todolistsApi.getTodolists()
    return { todolists: res.data }
  } catch (error) {
    return rejectWithValue(null)
  }
})

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

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (title: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const res = await todolistsApi.createTodolist(title)
      const newTodo = res.data.data.item
      return { todolist: newTodo }
      // dispatch(createTodolistAC({ todolist: newTodo }))
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (payload: { id: string }, thunkAPI) => {
    const { id } = payload
    const { rejectWithValue } = thunkAPI
    try {
      await todolistsApi.deleteTodolist(id)
      return { id }
      // dispatch(deleteTodolistAC({ id }))
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const { changeTodolistFilterAC } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
