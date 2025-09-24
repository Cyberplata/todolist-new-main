import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { beforeEach, expect, test } from "vitest"
import { createTaskTC, deleteTaskTC, tasksReducer, type TasksState, updateTaskTC } from "../tasks-slice.ts"

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
  { id: "1", title: "CSS", status: TaskStatus.New, todoListId: "todolistId1", ...taskDefaultValues },
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
  const newTaskForCreate: DomainTask = {
    ...taskDefaultValues,
    id: "100", // уникальный id, которого нет в startState
    title: "coffee",
    todoListId: "todolistId2",
    status: TaskStatus.New,
  }

  const actionPayload = { task: newTaskForCreate }
  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled(actionPayload, "requestId", {
      todolistId: newTaskForCreate.todoListId,
      title: newTaskForCreate.title,
    }),
  )

  expect(endState.todolistId1.length).toBe(3) // в первой без изменений
  expect(endState.todolistId2.length).toBe(4) // во второй добавилась новая
  expect(endState.todolistId2[0].id).toBe("100") // новая в начало
  expect(endState.todolistId2[0].title).toBe("coffee")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test("correct task should change its status and title", () => {
  const newTaskForUpdate: DomainTask = {
    ...taskDefaultValues,
    id: "3", // эта таска есть в startState.todolistId2
    title: "React",
    todoListId: "todolistId2",
    status: TaskStatus.New,
  }

  // изменённая версия этой же таски (как будто с бэка пришла)
  const updatedTask: DomainTask = {
    ...newTaskForUpdate,
    title: "juice",
    status: TaskStatus.Completed,
  }

  const actionPayload = { task: updatedTask }
  const arg = {
    todolistId: updatedTask.todoListId,
    taskId: updatedTask.id,
    domainModel: {
      title: updatedTask.title,
      status: updatedTask.status,
    },
  }

  const endState = tasksReducer(startState, updateTaskTC.fulfilled(actionPayload, "requestId", arg))

  const changedTask = endState[updatedTask.todoListId].find((t) => t.id === updatedTask.id)

  expect(changedTask).toBeDefined()
  expect(changedTask!.status).toBe(TaskStatus.Completed)
  expect(changedTask!.title).toBe("juice")
})

test("array should be created for new todolist", () => {
  const newTodolist = {
    id: "todolistId3",
    title: "New todolist",
    order: 0,
    addedDate: "",
  }

  const action = createTodolistTC.fulfilled(newTodolist, "requestId", newTodolist.title)

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k === "todolistId3")
  expect(newKey).toBeDefined()
  expect(keys.length).toBe(3)
  expect(endState["todolistId3"]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const action = deleteTodolistTC.fulfilled({ id: "todolistId2" }, "requestId", { id: "todolistId2" })

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).toBeUndefined()
})


// test("array should be created for new todolist", () => {
//   const endState = tasksReducer(startState, createTodolistTC.fulfilled("New todolist"))
//
//   const keys = Object.keys(endState)
//   const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
//   if (!newKey) {
//     throw Error("New key should be added")
//   }
//
//   expect(keys.length).toBe(3)
//   expect(endState[newKey]).toEqual([])
// })

// test("property with todolistId should be deleted", () => {
//   const endState = tasksReducer(startState, deleteTodolistTC({ id: "todolistId2" }))
//
//   const keys = Object.keys(endState)
//
//   expect(keys.length).toBe(1)
//   expect(endState["todolistId2"]).not.toBeDefined()
//   // or
//   expect(endState["todolistId2"]).toBeUndefined()
// })

// const newTask: DomainTask = {
//   id: "3",
//   title: "juice",
//   todoListId: "todolistId2",
//   status: TaskStatus.New,
//   description: "",
//   startDate: "",
//   deadline: "",
//   addedDate: "",
//   order: 0,
//   priority: TaskPriority.Low,
// }

// test("correct task should be created at correct array", () => {
//   const { todoListId: todolistId, title } = newTask
//   const actionPayload = { task: newTask }
//   const endState = tasksReducer(startState, createTaskTC.fulfilled(actionPayload, "requestId", { todolistId, title }))
//
//   expect(endState.todolistId1.length).toBe(3)
//   expect(endState.todolistId2.length).toBe(4)
//   expect(endState.todolistId2[0].id).toBeDefined()
//   expect(endState.todolistId2[0].title).toBe("juice")
//   expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
// })

// test("correct task should change its status and title", () => {
//   const { todoListId, id } = newTask
//   // создаём изменённую таску, как будто с бэка вернулась
//   const updatedTask: DomainTask = {
//     ...newTask,
//     status: TaskStatus.New,
//     title: "juice",
//     todoListId,
//     // id: "3"
//   }
//   const actionPayload = { task: updatedTask }
//
//   const UpdateTaskModel: Partial<UpdateTaskModel> = {
//     description: newTask.description,
//     title: newTask.title,
//     status: TaskStatus.New,
//     priority: TaskPriority.Low,
//     startDate: newTask.startDate,
//     deadline: newTask.deadline,
//   }
//
//   // аргумент, который мы передаём в санку (как бы "на сервер")
//   const arg = {
//     todolistId: todoListId,
//     taskId: id,
//     domainModel: UpdateTaskModel,
//   }
//
//   const endState = tasksReducer(
//     startState,
//     updateTaskTC.fulfilled(actionPayload, "requestId", arg)
//   )
//
//   expect(endState[todoListId].find(t => t.id === id)?.status).toBe(TaskStatus.New)
//   expect(endState[todoListId].find(t => t.id === id)?.title).toBe("juice")
// })