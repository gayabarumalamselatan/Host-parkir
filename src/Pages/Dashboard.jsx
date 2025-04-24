import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Nav from "../Layout/Nav";
import Sidebar from "../Layout/Sidebar";
import { useState } from "react";
import Content from "../Layout/Content";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    if(!isLoggedIn) {
      navigate('/login')
    }
  },[])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  console.log('sidebar', sidebarOpen)

  return (
    <div className="d-flex flex-row w-100 dashboard-custom" style={{height: '100vh'}}>
        <Sidebar show={sidebarOpen}/>
      
      <div className="w-100">
        <Nav toggleSidebar={toggleSidebar} show={sidebarOpen}/>
        <div className="content-custom">
          <Content show={sidebarOpen}/>
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard