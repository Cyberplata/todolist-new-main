import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { selectTodolists } from "@/features/todolists/model/todolists-selectors"
import { setTodolistsAC } from "@/features/todolists/model/todolists-slice.ts"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { useEffect } from "react"
import { TodolistItem } from "./TodolistItem/TodolistItem"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)

  const dispatch = useAppDispatch()

  useEffect(() => {
    todolistsApi.getTodolists().then((res) => {
      const todolists = res.data
      console.log(todolists)
      dispatch(setTodolistsAC({ todolists }))
    })
  }, [])

  return (
    <>
      {todolists.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
