import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"
import { fetchTodolistsTC, selectTodolists } from "@/features/todolists/model/todolists-slice.ts"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { useEffect } from "react"
import { TodolistItem } from "./TodolistItem/TodolistItem"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)

  const dispatch = useAppDispatch()

  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  useEffect(() => {
    // ✅ Запрос только для авторизованных пользователей
    if (isLoggedIn) {
      dispatch(fetchTodolistsTC())
    }
  }, [dispatch, isLoggedIn]) // 🔥 isLoggedIn в зависимостях

  // ✅ Показываем компонент только авторизованным
  if (!isLoggedIn) {
    return null // или <Navigate to="/login" />
  }

  // useEffect(() => {
  //   dispatch(fetchTodolistsTC())
  // }, [])

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
