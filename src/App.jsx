import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import './Style/Style.css'
import SessionTimeout from "./Config/SessionTimeout"
import { NotificationProvider } from "./Context/NotificationProvider"
import { ToastContainer } from "react-toastify"

function App() {

  return (
    <NotificationProvider>
        <BrowserRouter>
          <SessionTimeout/>
          <Routes>
            <Route>
              <Route exact path="*" element={<Dashboard/>}/>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/Dashboard" element={<Dashboard/>}/>
              <Route path="*" element={<Dashboard/>}/>
            </Route>
          </Routes>
          <ToastContainer/>
        </BrowserRouter>
    </NotificationProvider>
  )
}

export default App
