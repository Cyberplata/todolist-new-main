import { setAppStatusAC } from "@/app/app-slice.ts"
import type { RootState } from "@/app/store.ts"
import { TaskStatus } from "@/common/enums"
import { createAppSlice } from "@/common/utils"
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
          dispatch(setAppStatusAC({ status: "succeeded" }))
          const newTask = res.data.data.item
          return { task: newTask }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
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
      async (payload: { todolistId: string; taskId: string }, { rejectWithValue }) => {
        try {
          await tasksApi.deleteTask(payload)
          return payload
        } catch (error) {
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
    // var1 - Решение через getState()
    _changeTaskStatusTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string; status: TaskStatus }, thunkAPI) => {
        const { todolistId, taskId, status } = payload
        const { rejectWithValue, getState } = thunkAPI
        // debugger
        const allTodolistTasks = (getState() as RootState).tasks[todolistId]
        const task = allTodolistTasks.find((task) => task.id === taskId)

        if (!task) {
          return rejectWithValue(null)
        }

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status,
        }

        try {
          const res = await tasksApi.updateTask({ todolistId, taskId, model })
          const newTask = res.data.data.item
          return { task: newTask }
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTask = action.payload.task
          const task = state[newTask.todoListId].find((task) => task.id === newTask.id)
          if (task) {
            task.status = newTask.status
          }
        },
      },
    ),
    // var2 - Решение через передачу task через props в TaskItem в changeTaskStatusTC
    __changeTaskStatusTC: create.asyncThunk(
      async (task: DomainTask, { rejectWithValue }) => {
        const { todoListId, id, description, title, priority, startDate, deadline, status } = task

        const model: UpdateTaskModel = {
          description,
          title,
          priority,
          startDate,
          deadline,
          status,
        }

        try {
          const res = await tasksApi.updateTask({ todolistId: todoListId, taskId: id, model })
          const newTask = res.data.data.item
          return { task: newTask }
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTask = action.payload.task
          const task = state[newTask.todoListId].find((task) => task.id === newTask.id)
          if (task) {
            task.status = newTask.status
          }
        },
      },
    ),
    // var3 - передаём всю task в model, так как бэк позволяет, хотя должен выдать ошибку
    changeTaskStatusTC: create.asyncThunk(
      async (task: DomainTask, { rejectWithValue, dispatch }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model: task })
          dispatch(setAppStatusAC({ status: "succeeded" }))
          const newTask = res.data.data.item
          return { task: newTask }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTask = action.payload.task
          const task = state[newTask.todoListId].find((task) => task.id === newTask.id)
          if (task) {
            task.status = newTask.status
          }
        },
      },
    ),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
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

export const { fetchTasksTC, createTaskTC, deleteTaskTC, changeTaskStatusTC, changeTaskTitleAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
