import { useAppSelector } from "@/common/hooks/useAppSelector.ts"
import { selectTodolists } from "@/model/todolists-selectors.ts"
import { TodolistItem } from "@/TodolistItem.tsx"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)

  return (
    <>
      {todolists.map((todolist) => {
        return (
          <Grid key={todolist.id}>
            <Paper sx={{ p: "0 20px 20px 20px" }}>
              <TodolistItem todolist={todolist} />
            </Paper>
          </Grid>
        )
      })}
    </>
  )
}
