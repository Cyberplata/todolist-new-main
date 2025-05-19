import { setAppStatusAC } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums/enums.ts"
import type { RequestStatus } from "@/common/types"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { type DomainTask, DomainTaskSchema, type UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
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
          const tasks = DomainTaskSchema.array().parse(res.data.items) // ZOD validate
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { tasks, todolistId }
        } catch (error: any) {
          console.log(error)
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          // state[action.payload.todolistId] = action.payload.tasks
          // if (!action.payload) return
          state[action.payload?.todolistId] = action.payload.tasks.map((t) => ({ ...t, entityStatus: "idle" }))
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
          // const newTask: DomainTask = action.payload.task
          const newTask: TaskWithStatus = {
            ...action.payload.task,
            entityStatus: "idle",
          }
          state[newTask.todoListId].unshift(newTask)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, { rejectWithValue, dispatch }) => {
        const { todolistId, taskId } = payload
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "loading" }))
          const res = await tasksApi.deleteTask(payload)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return payload
          } else {
            dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "failed" }))
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "failed" }))
          handleServerNetworkError(dispatch, error)
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
      async (task: TaskWithStatus, thunkAPI) => {
        const { todoListId, id } = task
        const { rejectWithValue, dispatch } = thunkAPI

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
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

    // updateTaskTC: create.asyncThunk(
    //   async (
    //     payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
    //     { dispatch, getState, rejectWithValue },
    //   ) => {
    //     const { todolistId, taskId, domainModel } = payload
    //
    //     const allTodolistTasks = (getState() as RootState).tasks[todolistId]
    //     const task = allTodolistTasks.find((task) => task.id === taskId)
    //
    //     if (!task) {
    //       return rejectWithValue(null)
    //     }
    //
    //     const model: UpdateTaskModel = {
    //       description: task.description,
    //       title: task.title,
    //       priority: task.priority,
    //       startDate: task.startDate,
    //       deadline: task.deadline,
    //       status: task.status,
    //       ...domainModel,
    //     }
    //
    //     try {
    //       dispatch(setAppStatusAC({ status: "loading" }))
    //       // dispatch(changeTodolistStatusAC({ id: taskId, entityStatus: "loading" }))
    //       const res = await tasksApi.updateTask({ todolistId, taskId, model })
    //       if (res.data.resultCode === ResultCode.Success) {
    //         dispatch(setAppStatusAC({ status: "succeeded" }))
    //         return { task: res.data.data.item }
    //       } else {
    //         // dispatch(changeTodolistStatusAC({ id: todolistId, entityStatus: "idle" }))
    //         handleServerAppError(res.data, dispatch)
    //         return rejectWithValue(null)
    //       }
    //     } catch (error) {
    //       // dispatch(changeTodolistStatusAC({ id: todolistId, entityStatus: "idle" }))
    //       handleServerNetworkError(dispatch, error)
    //       return rejectWithValue(null)
    //     }
    //   },
    //   {
    //     fulfilled: (state, action) => {
    //       const allTodolistTasks = state[action.payload.task.todoListId]
    //       const taskIndex = allTodolistTasks.findIndex((task) => task.id === action.payload.task.id)
    //       if (taskIndex !== -1) {
    //         allTodolistTasks[taskIndex] = action.payload.task
    //       }
    //     },
    //   },
    // ),

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
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload!.id]
      })
  },
})

export const { fetchTasksTC, createTaskTC, deleteTaskTC, updateTaskTC, changeTaskEntityStatusAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

// export type TasksState = Record<string, DomainTask[]>
export type TasksState = Record<string, TaskWithStatus[]>
export type TaskWithStatus = DomainTask & { entityStatus: RequestStatus }
