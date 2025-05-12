import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import { useAppDispatch } from "@/common/hooks"
import { deleteTaskTC, type TaskWithStatus, updateTaskTC } from "@/features/todolists/model/tasks-slice.ts"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"

type Props = {
  todolist: DomainTodolist
  task: TaskWithStatus
}

export const TaskItem = ({ task, todolist }: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId: todolist.id, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const newTask = { ...task, status: newStatusValue }
    dispatch(updateTaskTC(newTask))

    // const newStatusValue = e.currentTarget.checked
    // dispatch(
    //   updateTaskTC({
    //     todolistId: todolist.id,
    //     taskId: task.id,
    //     domainModel: { status: newStatusValue ? TaskStatus.Completed : TaskStatus.New },
    //   }),
    // )
  }

  const changeTaskTitle = (title: string) => {
    const newTask = { ...task, title }
    dispatch(updateTaskTC(newTask))

    // dispatch(updateTaskTC({ todolistId: todolist.id, taskId: task.id, domainModel: { title } }))
  }

  const isTaskCompleted = task.status === TaskStatus.Completed
  const disabled = task.entityStatus === "loading"

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} disabled={disabled} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={disabled} />
      </div>
      <IconButton onClick={deleteTask} disabled={disabled}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
