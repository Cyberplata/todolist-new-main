import { CreateItemForm, EditableSpan } from "@/common/components"
import { TaskStatus } from "@/common/enums"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import Checkbox from "@mui/material/Checkbox"
import { type ChangeEvent, type CSSProperties, useState } from "react"

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({})

  // useEffect(() => {
  //   todolistsApi.getTodolists().then((res) => {
  //     const todolists = res.data
  //     setTodolists(todolists)
  //     todolists.forEach((todolist) => {
  //       tasksApi.getTasks(todolist.id).then((res) => {
  //         const newTasks = res.data.items
  //         setTasks((prevTasks) => ({ ...prevTasks, [todolist.id]: newTasks }))
  //       })
  //     })
  //   })
  // }, [])

  const createTodolist = (title: string) => {
    todolistsApi.createTodolist(title).then((res) => {
      const newTodolist = res.data.data.item
      // setTodolists([newTodolist, ...todolists])
      // setTodolists((prevTodolists) => [newTodolist, ...prevTodolists])
      setTodolists([newTodolist, ...todolists])
      setTasks({ ...tasks, [newTodolist.id]: [] })
    })
  }

  const deleteTodolist = (id: string) => {
    todolistsApi.deleteTodolist(id).then(() => {
      setTodolists(todolists.filter((todolist) => todolist.id !== id))
      delete tasks[id]
      setTasks({ ...tasks })

      // setTodolists((prevTodolists) => prevTodolists.filter((todolist) => todolist.id !== id))
      // setTodolists(todolists.filter(todolist => todolist.id !== id))
    })
  }

  // const changeTodolistTitle = (id: string, title: string) => {
  //   todolistsApi.changeTodolistTitle({ id, title }).then(() => {
  //     // setTodolists(todolists.map((todolist) => (todolist.id === id ? { ...todolist, title } : todolist)))
  //     setTodolists((prevTodolists) => prevTodolists.map((tl) => (tl.id === id ? { ...tl, title } : tl)))
  //   })
  // }

  const createTask = (todolistId: string, title: string) => {
    tasksApi.createTask({ todolistId, title }).then((res) => {
      const newTask = res.data.data.item
      // setTasks((prevTasks) => ({
      //   ...prevTasks,
      //   [todolistId]: [newTask, ...(prevTasks[todolistId] || [])],
      // }))
      setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] })
    })
  }

  const deleteTask = (todolistId: string, taskId: string) => {
    tasksApi.deleteTask({ todolistId, taskId }).then((res) => {
      // console.log(res.data)
      setTasks((prevTasks) => ({
        ...prevTasks,
        [todolistId]: prevTasks[todolistId].filter((t) => t.id !== taskId),
      }))
    })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    const todolistId = task.todoListId

    const model: UpdateTaskModel = {
      description: task.description,
      title: task.title,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      status: e.target.checked ? TaskStatus.Completed : TaskStatus.New,
    }

    tasksApi.updateTask({ todolistId, taskId: task.id, model }).then((res) => {
      const newTask = res.data.data.item
      setTasks((prevTasks) => ({
        ...prevTasks,
        [todolistId]: prevTasks[todolistId].map((t) => (t.id === task.id ? newTask : t)),
      }))
    })

    // tasksApi.updateTask({ todolistId, taskId: task.id, model }).then(() => {
    //   setTasks({ ...tasks, [todolistId]: tasks[todolistId].map((t) => (t.id === task.id ? { ...t, ...model } : t)) })
    // })
  }

  const changeTaskTitle = (task: DomainTask, title: string) => {
    const todolistId = task.todoListId
    const taskId = task.id

    const model: UpdateTaskModel = {
      description: task.description,
      title,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      status: task.status,
    }

    tasksApi.updateTask({ todolistId, model, taskId }).then(() => {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [todolistId]: prevTasks[todolistId].map((t) => (t.id === task.id ? { ...t, ...model } : t)),
      }))
      // const newTasks = tasks[task.todoListId].map((t) => (t.id === task.id ? { ...t, ...model } : t))
      // setTasks({ ...tasks, [task.todoListId]: newTasks })
    })
  }

  return (
    <div style={{ margin: "20px" }}>
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map((todolist) => (
        <div key={todolist.id} style={container}>
          <div>
            <EditableSpan value={todolist.title} onChange={(title) => changeTodolistTitle(todolist.id, title)} />
            <button onClick={() => deleteTodolist(todolist.id)}>x</button>
          </div>
          <CreateItemForm onCreateItem={(title) => createTask(todolist.id, title)} />
          {tasks[todolist.id]?.map((task) => (
            <div key={task.id}>
              <Checkbox checked={task.status === TaskStatus.Completed} onChange={(e) => changeTaskStatus(e, task)} />
              <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task, title)} />
              <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const container: CSSProperties = {
  border: "1px solid black",
  margin: "20px 0",
  padding: "10px",
  width: "300px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
}
