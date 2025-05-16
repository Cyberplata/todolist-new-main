import { Main } from "@/app/Main"
import { Route, Routes } from "react-router"

export const Routing = () => (
  <Routes>
    <Route path="/" element={<Main />} />
  </Routes>
)