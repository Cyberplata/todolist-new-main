import { setAppStatusAC } from "@/app/app-slice.ts"
import { RootState } from "@/app/store.ts"
import { ResultCode } from "@/common/enums/enums.ts"
import type { RequestStatus } from "@/common/types"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import {
  createTasksSchema,
  deleteTaskSchema,
  type DomainTask,
  getTasksResponseSchema,
  type UpdateTaskModel,
  updateTaskSchema,
} from "@/features/todolists/api/tasksApi.types.ts"
import { createTodolistTC, deleteTodolistTC } from "./todolists-slice.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)

          // 🚨 ТЕСТОВЫЙ ВЫБРОС ZodError
          // 💬 Здесь точно выбросит ZodError, потому что title должен быть string
          // const fakeInvalidData = { items: [{ title: 123 }], totalCount: 1, error: null }
          // getTasksResponseSchema.parse(fakeInvalidData)

          const parseRes = getTasksResponseSchema.parse(res.data) // Парсим весь ответ 💎
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolistId, tasks: parseRes.items }
        } catch (error: any) {
          console.error('ERROR CATCHED:', error)
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks.map((tl) => ({
            ...tl,
            filter: "all",
            entityStatus: "idle",
          }))
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(payload)
          const parseRes = createTasksSchema.parse(res.data)
          if (parseRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            const newTask = parseRes.data.item
            return { task: newTask }
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
          const newTask: TaskWithStatus = { ...action.payload.task, entityStatus: "idle" }
          state[newTask.todoListId].unshift(newTask)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        const { todolistId, taskId } = payload
        const { rejectWithValue, dispatch } = thunkAPI

        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "loading" }))
          const res = await tasksApi.deleteTask(payload)
          const parseRes = deleteTaskSchema.parse(res.data)
          if (parseRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return payload
          } else {
            dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "failed" }))
            handleServerAppError(parseRes, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "failed" }))
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    updateTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
        { dispatch, getState, rejectWithValue },
      ) => {
        const { todolistId, taskId, domainModel } = payload

        const allState = getState() as RootState
        const allTodolistTasks = allState.tasks[todolistId]
        const task = allTodolistTasks.find((task) => task.id === taskId)

        if (!task) return rejectWithValue(null)

        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({ todolistId: todolistId, taskId: taskId, domainModel })
          const parseRes = updateTaskSchema.parse(res.data)
          if (parseRes.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            const newTask = parseRes.data.item
            return { task: newTask }
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
          const { title, status, todoListId, id } = action.payload.task
          const task = state[todoListId].find((task) => task.id === id)
          if (task) {
            task.title = title
            task.status = status
          }
        },
      },
    ),
    changeTaskEntityStatusAC: create.reducer<{ todolistId: string; taskId: string; entityStatus: RequestStatus }>(
      (state, action) => {
        const tasks = state[action.payload.todolistId]
        const task = tasks.find((t) => t.id === action.payload.taskId)
        if (task) {
          task.entityStatus = action.payload.entityStatus
        }
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const { fetchTasksTC, createTaskTC, deleteTaskTC, updateTaskTC, changeTaskEntityStatusAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

// export type TasksState = Record<string, DomainTask[]>
export type TaskWithStatus = DomainTask & {
  entityStatus: RequestStatus
}
export type TasksState = Record<string, TaskWithStatus[]>
