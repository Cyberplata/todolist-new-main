import { setAppStatusAC } from "@/app/app-slice.ts"
import type { RootState } from "@/app/store.ts"
import { clearDataAC } from "@/common/actions"
import { ResultCode } from "@/common/enums"
import { type RequestStatus } from "@/common/types"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import {
  ChangeTodolistTitleSchema,
  CreateTodolistsSchema,
  DeleteTodolistSchema,
  type Todolist,
  TodolistSchema,
} from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, thunkAPI) => {
        const { rejectWithValue, dispatch, getState } = thunkAPI

        // Проверяем авторизацию
        const state = getState() as RootState
        if (!state.auth.isLoggedIn) {
          return rejectWithValue({ message: 'User not authorized' })
        }

        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          const parsedRes = TodolistSchema.array().parse(res.data)
          // return { todolists: res.data }
          // const parsedRes = safeParse(TodolistSchema.array(), res.data)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolists: parsedRes }
        } catch (error) {
          // console.log(error)
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((tl) => {
            state.push({ ...tl, filter: "all", entityStatus: "idle" })
          })
        },
        rejected: (_state, _action) => {
          // console.table(_action)
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
          // const todolist = TodolistSchema.parse(res.data.data.item)
          // const parsedRes = safeParse(CreateTodolistsSchema, res.data)
          // Парсим весь ответ с помощью CreateTodolistsSchema
          const parsedRes = CreateTodolistsSchema.parse(res.data)
          if (parsedRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            const newTodo = parsedRes.data.item
            return { todolist: newTodo }
          } else {
            handleServerAppError(parsedRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTodolists: DomainTodolist = {
            ...action.payload.todolist,
            filter: "all",
            entityStatus: "idle",
          }
          state.unshift(newTodolists)
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (id: string, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          dispatch(changeTodolistStatusAC({ id, entityStatus: "loading" }))
          const res = await todolistsApi.deleteTodolist(id)
          // const parsedRes = safeParse(DeleteTodolistSchema, res.data)
          const parsedRes = DeleteTodolistSchema.parse(res.data)
          if (parsedRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { id }
          } else {
            dispatch(changeTodolistStatusAC({ id, entityStatus: "failed" }))
            handleServerAppError(parsedRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          dispatch(changeTodolistStatusAC({ id, entityStatus: "failed" }))
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          // const index = state.findIndex((todolist) => todolist.id === action.payload?.id)
          // if (index !== -1) {
          //   state.splice(index, 1)
          // }
          return state.filter((todolist) => todolist.id !== action.payload?.id)
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (
        payload: {
          id: string
          title: string
        },
        thunkAPI,
      ) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.changeTodolistTitle(payload)
          // const parsedRes = safeParse(ChangeTodolistTitleSchema, res.data)
          const parsedRes = ChangeTodolistTitleSchema.parse(res.data)
          if (parsedRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return payload
          } else {
            handleServerAppError(parsedRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
        // rejected: (state, action) => {
        //   // вот тут будет обработка rejectWithValue?
        // }
      },
    ),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    changeTodolistStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(clearDataAC, () => {
        return []
      })
  }
})

export const {
  fetchTodolistsTC,
  createTodolistTC,
  deleteTodolistTC,
  changeTodolistTitleTC,
  changeTodolistFilterAC,
  changeTodolistStatusAC,
} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
