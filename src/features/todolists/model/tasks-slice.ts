import { setAppStatusAC } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums/enums.ts"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"

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
          dispatch(setAppStatusAC({ status: "succeeded" }))
          const newTasks = res.data.items
          return { tasks: newTasks, todolistId }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(payload)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            const newTask = res.data.data.item
            return { task: newTask }
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
          const newTask: DomainTask = action.payload.task
          state[newTask.todoListId].unshift(newTask)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          await tasksApi.deleteTask(payload)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return payload
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
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
      async (task: DomainTask, thunkAPI) => {
        const { todoListId, id, description, title, priority, startDate, deadline, status } = task
        const { rejectWithValue, dispatch } = thunkAPI

        const model: UpdateTaskModel = {
          description,
          title,
          priority,
          startDate,
          deadline,
          status,
        }

        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({ todolistId: todoListId, taskId: id, model })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            const newTask = res.data.data.item
            return { task: newTask }
          } else {
            // 200 проверка errors
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          // 400 - 500 errors
          handleServerNetworkError(dispatch, error)
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
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const { fetchTasksTC, createTaskTC, deleteTaskTC, updateTaskTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
