import { setAppStatusAC } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums"
import type { RequestStatus } from "@/common/types"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import {
  changeTodolistTitleSchema,
  createTodolistsSchema,
  deleteTodolistSchema,
  type Todolist,
  todolistSchema,
} from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_arg, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          const parseRes = todolistSchema.array().parse(res.data)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          // const todolists = res.data
          return { todolists: parseRes }
        } catch (error: any) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (_state, action) => {
          return action.payload.todolists.map((tl) => {
            return { ...tl, filter: "all", entityStatus: "idle" }
          })
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: string, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        dispatch(setAppStatusAC({ status: "loading" }))
        try {
          const res = await todolistsApi.createTodolist(title)
          const parseRes = createTodolistsSchema.parse(res.data)
          if (parseRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            const newTodo = parseRes.data.item
            return { todolist: newTodo }
          } else {
            handleServerAppError(parseRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (payload: { id: string }, thunkAPI) => {
        const { id } = payload
        const { rejectWithValue, dispatch } = thunkAPI

        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          dispatch(changeTodolistEntityStatusAC({ id, entityStatus: "loading" }))
          const res = await todolistsApi.deleteTodolist(id)
          const parseRes = deleteTodolistSchema.parse(res.data)
          if (parseRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { id }
          } else {
            dispatch(changeTodolistEntityStatusAC({ id, entityStatus: "failed" }))
            handleServerAppError(parseRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          dispatch(changeTodolistEntityStatusAC({ id, entityStatus: "failed" }))
          handleServerNetworkError(error, dispatch)
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
    changeTodolistTitleTC: create.asyncThunk(
      async (payload: { id: string; title: string }, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.changeTodolistTitle(payload)
          const parseRes = changeTodolistTitleSchema.parse(res.data)
          if (parseRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return payload
          } else {
            handleServerAppError(parseRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(error, dispatch)
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
      },
    ),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    changeTodolistEntityStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    }),
  }),
})

export const {
  fetchTodolistsTC,
  createTodolistTC,
  deleteTodolistTC,
  changeTodolistTitleTC,
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
