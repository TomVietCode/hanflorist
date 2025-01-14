import { useRoutes } from "react-router-dom"
import  routes  from "./admin/router"

function App() {
  const elements = useRoutes(routes)
  return (
    [elements]
  )
}

export default App