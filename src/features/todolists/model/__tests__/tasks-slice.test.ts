import type { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { createTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { beforeEach, expect, test } from "vitest"
import { createTaskTC, deleteTaskTC, tasksReducer, type TasksState, updateTaskTC } from "../tasks-slice.ts"
import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"

let startState: TasksState = {}

const taskDefaultValues = {
  description: "",
  deadline: "",
  addedDate: "",
  startDate: "",
  priority: TaskPriority.Low,
  order: 0,
}

const tasksForTodolist1 = [
  { id: "1", title: "CSS", status: TaskStatus.Completed, todoListId: "todolistId1", ...taskDefaultValues },
  { id: "2", title: "JS", status: TaskStatus.Completed, todoListId: "todolistId1", ...taskDefaultValues },
  { id: "3", title: "React", status: TaskStatus.New, todoListId: "todolistId1", ...taskDefaultValues },
]

const tasksForTodolist2 = [
  { id: "1", title: "bread", status: TaskStatus.New, todoListId: "todolistId2", ...taskDefaultValues },
  { id: "2", title: "milk", status: TaskStatus.Completed, todoListId: "todolistId2", ...taskDefaultValues },
  { id: "3", title: "tea", status: TaskStatus.New, todoListId: "todolistId2", ...taskDefaultValues },
]

beforeEach(() => {
  startState = {
    todolistId1: [...tasksForTodolist1],
    todolistId2: [...tasksForTodolist2],
  }
})

test("correct task should be deleted", () => {
  const payload = { todolistId: "todolistId2", taskId: "2" }
  const endState = tasksReducer(startState, deleteTaskTC.fulfilled(payload, "requestId", payload))

  const expectedTasksForTodolist2 = tasksForTodolist2.filter((t) => t.id !== payload.taskId)

  expect(endState).toEqual({
    todolistId1: tasksForTodolist1,
    todolistId2: expectedTasksForTodolist2,
  })
})

test("correct task should be created at correct array", () => {
  const newTask: DomainTask = {
    id: "4",
    title: "juice",
    todoListId: "todolistId2",
    status: TaskStatus.New,
    description: "",
    startDate: "",
    deadline: "",
    addedDate: "",
    order: 0,
    priority: TaskPriority.Low,
  }

  const { todoListId: todolistId, title } = newTask
  const actionPayload = { task: newTask }
  const endState = tasksReducer(startState, createTaskTC.fulfilled(actionPayload, "requestId", { todolistId, title }))

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test("correct task should change its status and title", () => {
  const newTask: DomainTask = {
    id: "2",
    title: "coffee",
    todoListId: "todolistId2",
    status: TaskStatus.New,
    description: "",
    startDate: "",
    deadline: "",
    addedDate: "",
    order: 0,
    priority: TaskPriority.Low,
  }

  const { todoListId, id } = newTask

  const actionPayload = { task: newTask }

  const endState = tasksReducer(startState, updateTaskTC.fulfilled(actionPayload, "requestId", newTask ))

  const updatedTaskInState = endState[todoListId].find((t) => t.id === id)

  expect(updatedTaskInState).toBeDefined()
  expect(updatedTaskInState!.status).toBe(TaskStatus.New)
  expect(updatedTaskInState!.title).toBe("coffee")
})

test("array should be created for new todolist", () => {
  // const endState = tasksReducer(startState, createTodolistAC("New todolist"))
  const endState = tasksReducer(startState, createTodolistTC.fulfilled())

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(startState, deleteTodolistAC({ id: "todolistId2" }))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
