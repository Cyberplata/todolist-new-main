import { Path } from "@/common/routing"
import Button from "@mui/material/Button"
import { NavLink } from "react-router"
import styles from "./PageNotFound.module.css"

export const PageNotFound = () => (
  <>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    {/*<Button*/}
    {/*  component={MenuButton}*/}
    {/*  href={Path.Main}*/}
    {/*  sx={{*/}
    {/*    margin: "30px auto",*/}
    {/*    backgroundColor: "primary.light",*/}
    {/*    color: "white",*/}
    {/*    "&:hover": { backgroundColor: "primary.main" },*/}
    {/*  }}*/}
    {/*>*/}
    {/*  To the main page*/}
    {/*</Button>*/}
    <Button
      component={NavLink}
      to={Path.Main}
      sx={{
        margin: "30px auto",
        textDecoration: "none",
        backgroundColor: "primary.light",
        color: "white",
        "&:hover": { backgroundColor: "primary.main" },
      }}
    >
      To the main page
    </Button>
  </>
)
