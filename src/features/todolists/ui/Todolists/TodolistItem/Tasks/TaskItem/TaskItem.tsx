import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import { useAppDispatch } from "@/common/hooks"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { changeTaskStatusTC, changeTaskTitleAC, deleteTaskTC } from "@/features/todolists/model/tasks-slice.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"

type Props = {
  task: DomainTask
  todolistId: string
}

export const TaskItem = ({ task, todolistId }: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    // var1 - getState()
    // const newStatusValue = e.currentTarget.checked
    // dispatch(
    //   changeTaskStatusTC({
    //     todolistId,
    //     taskId: task.id,
    //     status: newStatusValue ? TaskStatus.Completed : TaskStatus.New,
    //   }),
    // )

    // var 2 - task
    const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const newTask = { ...task, status: newStatusValue}
    dispatch(changeTaskStatusTC(newTask))
  }

  const changeTaskTitle = (title: string) => {
    dispatch(changeTaskTitleAC({ todolistId, taskId: task.id, title }))
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
