import { useAppDispatch } from "@/common/hooks/useAppDispatch.ts"
import { FilterButtons } from "@/FilterButtons.tsx"
import { createTaskAC } from "@/model/tasks-reducer.ts"
import type { Todolist } from "@/model/todolists-reducer.ts"
import { Tasks } from "@/Tasks.tsx"
import { TodolistTitle } from "@/TodolistTitle.tsx"
import { CreateItemForm } from "./CreateItemForm"

type Props = {
  todolist: Todolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  const createTask = (title: string) => {
    dispatch(createTaskAC({ todolistId: todolist.id, title }))
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTask} />
      <Tasks todolist={todolist} />

      <FilterButtons todolist={todolist} />
    </div>
  )
}
