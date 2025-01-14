import { Navigate, Outlet } from "react-router-dom"
import { getLocalStorage } from "../share/hepler/localStorage"

function PrivateRoute() {
  const isLogin = getLocalStorage("token")
  console.log(isLogin)
  return (

    <>  
      {isLogin.length > 0 ? (<Outlet/>) : (<Navigate to="/admin/login"/>)}
    </>
  )
}

export default PrivateRoute