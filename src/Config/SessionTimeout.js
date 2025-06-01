import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionTimeout = () => {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const sessionDuration = 30*60*1000
  console.log("si",isLoggedIn);

  useEffect(() => {
    if(isLoggedIn){
      const timeOut = setTimeout(() => {
        sessionStorage.clear();
        navigate("/login");
      }, sessionDuration);

      return () => clearTimeout(timeOut)
    }
  },[isLoggedIn, navigate])

  return null
}

export default SessionTimeout