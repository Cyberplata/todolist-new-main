import { useAppDispatch } from "@/common/hooks/useAppDispatch.ts"
import { useAppSelector } from "@/common/hooks/useAppSelector.ts"
import { EditableSpan } from "@/EditableSpan.tsx"
import { changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC } from "@/model/tasks-reducer.ts"
import { selectTasks } from "@/model/tasks-selectors.ts"
import { Todolist } from "@/model/todolists-reducer.ts"
import { getListItemSx } from "@/TodolistItem.styles.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"

type Props = {
  todolist: Todolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const tasks = useAppSelector(selectTasks)

  const dispatch = useAppDispatch()

  const todolistTasks = tasks[id]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task) => !task.isDone)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task) => task.isDone)
  }

  return (
    <>
      {filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks.map((task) => {
            const deleteTask = () => {
              dispatch(deleteTaskAC({ todolistId: id, taskId: task.id }))
            }

            const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
              const newStatusValue = e.currentTarget.checked
              dispatch(changeTaskStatusAC({ todolistId: id, taskId: task.id, isDone: newStatusValue }))
            }

            const changeTaskTitle = (title: string) => {
              dispatch(changeTaskTitleAC({ todolistId: id, taskId: task.id, title }))
            }

            return (
              <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
                <div>
                  <Checkbox checked={task.isDone} onChange={changeTaskStatus} />
                  <EditableSpan value={task.title} onChange={changeTaskTitle} />
                </div>
                <IconButton onClick={deleteTask}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            )
          })}
        </List>
      )}
    </>
  )
}
