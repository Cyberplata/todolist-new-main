import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi.ts"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { useState } from "react"
import { TodolistItem } from "./TodolistItem/TodolistItem"

export const Todolists = () => {
  // const { data: todolists } = useGetTodolistsQuery()

  // Реализация запроса по условию - Conditional fetching
  const [skip, setSkip] = useState(true)

  const { data: todolists } = useGetTodolistsQuery(undefined, { skip })

  const fetchTodolists = () => {
    setSkip(false)
  }

  return (
    <>
      <div>
        <button onClick={fetchTodolists}>Download todolists</button>
      </div>
      {todolists?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
