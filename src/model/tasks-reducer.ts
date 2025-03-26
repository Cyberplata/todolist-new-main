import { createAction, createReducer, nanoid } from "@reduxjs/toolkit"
import type { TasksState } from "../app/App.tsx"
import { createTodolistAC, deleteTodolistAC } from "./todolists-reducer"

const initialState: TasksState = {}

export const tasksReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(createTodolistAC, (state, action) => {
      state[action.payload.id] = []
    })
    .addCase(deleteTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    .addCase(deleteTaskAC, (state, action) => {
      const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        state[action.payload.todolistId].splice(index, 1)
      }
    })
    .addCase(createTaskAC, (state, action) => {
      state[action.payload.todolistId].unshift({ title: action.payload.title, id: nanoid(), isDone: false })
    })
    .addCase(changeTaskStatusAC, (state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.isDone = action.payload.isDone
      }
    })
    .addCase(changeTaskTitleAC, (state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    })
})

// export const _tasksReducer = (state: TasksState = initialState, action: Actions): TasksState => {
//   switch (action.type) {
//     case "delete_task": {
//       return {
//         ...state,
//         [action.payload.todolistId]: state[action.payload.todolistId].filter(
//           (task) => task.id !== action.payload.taskId,
//         ),
//       }
//     }
//     case "create_task": {
//       const newTask: Task = { title: action.payload.title, isDone: false, id: nanoid() }
//       return { ...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]] }
//     }
//     case "change_task_status": {
//       return {
//         ...state,
//         [action.payload.todolistId]: state[action.payload.todolistId].map((task) =>
//           task.id === action.payload.taskId ? { ...task, isDone: action.payload.isDone } : task,
//         ),
//       }
//     }
//     case "change_task_title": {
//       return {
//         ...state,
//         [action.payload.todolistId]: state[action.payload.todolistId].map((task) =>
//           task.id === action.payload.taskId ? { ...task, title: action.payload.title } : task,
//         ),
//       }
//     }
//     case "create_todolist": {
//       return { ...state, [action.payload.id]: [] }
//     }
//     case "delete_todolist": {
//       const newState = { ...state }
//       delete newState[action.payload.id]
//       return newState
//     }
//     default:
//       return state
//   }
// }

export const deleteTaskAC = createAction<{ todolistId: string; taskId: string }>("tasks/deleteTask")

export const createTaskAC = createAction<{ todolistId: string; title: string }>("tasks/createTask")

export const changeTaskStatusAC = createAction<{
  todolistId: string
  taskId: string
  isDone: boolean
}>("tasks/changeTaskStatus")

export const changeTaskTitleAC = createAction<{
  todolistId: string
  taskId: string
  title: string
}>("tasks/changeTaskTitle")
