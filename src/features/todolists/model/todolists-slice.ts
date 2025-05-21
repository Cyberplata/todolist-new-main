import { setAppStatusAC } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums"
import type { RequestStatus } from "@/common/types"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { type Todolist, TodolistSchema } from "@/features/todolists/api/todolistsApi.types.ts"

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
          TodolistSchema.array().parse(res.data)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolists: res.data }
        } catch (error) {
          console.log(error)
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
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            const newTodo = res.data.data.item
            return { todolist: newTodo }
          } else {
            handleServerAppError(res.data, dispatch)
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
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { id }
          } else {
            dispatch(changeTodolistStatusAC({ id, entityStatus: "failed" }))
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          dispatch(changeTodolistStatusAC({ id, entityStatus: "failed" }))
          handleServerNetworkError(dispatch, error)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload?.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
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
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return payload
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload?.id)
          if (index !== -1) {
            state[index].title = action.payload!.title
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
    changeTodolistStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
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
  changeTodolistStatusAC,
} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
