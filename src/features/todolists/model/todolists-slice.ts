import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        return action.payload.todolists.map((tl) => {
          return { ...tl, filter: "all" }
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
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.push({
          ...action.payload,
          filter: "all",
          addedDate: "",
          order: 0,
        })
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
  },
  reducers: (create) => ({
    // setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((_state, action) => {
    //   return action.payload.todolists.map((tl) => {
    //     return { ...tl, filter: "all" }
    //   })
    // }),
    // deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
    //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
    //   if (index !== -1) {
    //     state.splice(index, 1)
    //   }
    // }),
    // createTodolistAC: create.preparedReducer(
    //   (title: string) => ({ payload: { title, id: nanoid() } }),
    //   (state, action) => {
    //     state.push({
    //       ...action.payload,
    //       filter: "all",
    //       addedDate: "",
    //       order: 0,
    //     })
    //   },
    // ),
    // changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
    //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
    //   if (index !== -1) {
    //     state[index].title = action.payload.title
    //   }
    // }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
  }),
})

// TC
export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const res = await todolistsApi.getTodolists()
    const newTodolists = res.data
    return { todolists: newTodolists } // вместо dispatch(setTodolistsAC({ todolists: newTodolists })) и отлавливаем это значение в extraReducers
  } catch (error) {
    // console.log(error)
    return rejectWithValue(null)
  }
})

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (title: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await todolistsApi.createTodolist(title)
      return res.data.data.item
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (payload: { id: string; title: string }, thunkAPI) => {
    // const { id, title } = payload
    const { rejectWithValue } = thunkAPI
    try {
      await todolistsApi.changeTodolistTitle(payload)
      return payload
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
