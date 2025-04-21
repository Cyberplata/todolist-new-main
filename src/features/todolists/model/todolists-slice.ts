import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
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
      .addCase(fetchTodolistsTC.rejected, (state, action) => {
        // обработка ошибки при запросе за тудулистами
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(changeTodolistTitleTC.rejected, (state, action) => {
        // обработка ошибки при запросе на смену имени тудулиста
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
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      await todolistsApi.createTodolist(title)
      dispatch(createTodolistAC(title))
      // .then((res) => {
      // const newTodolist = res.data.data.item
      // setTodolists([newTodolist, ...todolists])
      // setTasks({ ...tasks, [newTodolist.id]: [] })
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const { deleteTodolistAC, changeTodolistFilterAC, createTodolistAC } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
