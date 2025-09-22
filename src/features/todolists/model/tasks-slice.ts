import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
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
        const { rejectWithValue } = thunkAPI
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch (error) {
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
        const { rejectWithValue } = thunkAPI
        try {
          const res = await tasksApi.createTask(payload)
          return { task: res.data.data.item }
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTask: DomainTask = action.payload.task
          const { todoListId } = newTask
          state[todoListId].unshift(newTask)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        const { rejectWithValue } = thunkAPI
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
    // Решение через getState()
    // _changeTaskStatusTC: create.asyncThunk(
    //   async (payload: { todolistId: string; taskId: string; status: TaskStatus }, thunkAPI) => {
    //     const { rejectWithValue, getState } = thunkAPI
    //     const { todolistId, taskId, status } = payload
    //
    //     const allState = getState() as RootState
    //     const allTodolistTasks = allState.tasks[todolistId]
    //     const task = allTodolistTasks.find((task) => task.id === taskId)
    //
    //     if (!task) {
    //       return thunkAPI.rejectWithValue(null)
    //     }
    //
    //     const model: UpdateTaskModel = {
    //       description: task.description,
    //       title: task.title,
    //       priority: task.priority,
    //       startDate: task.startDate,
    //       deadline: task.deadline,
    //       status,
    //     }
    //     try {
    //       const res = await tasksApi.updateTask({ todolistId, taskId, model })
    //       return { task: res.data.data.item }
    //     } catch (error) {
    //       return rejectWithValue(null)
    //     }
    //   },
    //   {
    //     fulfilled: (state, action) => {
    //       const { todoListId, id, status } = action.payload.task
    //       const task = state[todoListId].find((task) => task.id === id)
    //       if (task) {
    //         task.status = status ? TaskStatus.Completed : TaskStatus.New
    //       }
    //     },
    //   },
    // ),
    // Решение через передачу task через props в TaskItem в changeTaskStatusTC
    changeTaskStatusTC: create.asyncThunk(
      async (task: DomainTask, thunkAPI) => {
        const { todoListId: todolistId, id: taskId } = task
        const { rejectWithValue } = thunkAPI

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
        }
        try {
          const res = await tasksApi.updateTask({ todolistId, taskId, model })
          return { task: res.data.data.item }
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
        state[action.payload.id] = []
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
