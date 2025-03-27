import { createAction, createReducer, nanoid } from "@reduxjs/toolkit"
import type { Task, TasksState } from "../app/App.tsx"
import { createTodolistAC, deleteTodolistAC } from "./todolists-reducer"

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
      const tasks = state[action.payload.todolistId]
      if (tasks) {
        const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) {
          tasks.splice(index, 1)
        }
      }
    })
    .addCase(createTaskAC, (state, action) => {
      const tasks = state[action.payload.todolistId]
      if (tasks) {
        const newTask: Task = { title: action.payload.title, id: nanoid(), isDone: false }
        tasks.unshift(newTask)
      }
    })
    .addCase(changeTaskStatusAC, (state, action) => {
      const tasks = state[action.payload.todolistId]
      if (tasks) {
        const task = tasks.find((task) => task.id === action.payload.taskId)
        if (task) {
          task.isDone = action.payload.isDone
        }
      }
    })
    .addCase(changeTaskTitleAC, (state, action) => {
      const tasks = state[action.payload.todolistId]
      if (tasks) {
        const task = tasks.find((task) => task.id === action.payload.taskId)
        if (task) {
          task.title = action.payload.title
        }
      }
    })
})