import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_LOGIN_SERVICE } from "../Config/URLConstant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setpassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  // const [errMsg ,setErrMsg] = useState()

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // const requestData = {userName, password};
      const response = await axios.post(
        `${AUTH_LOGIN_SERVICE}`,
        JSON.stringify({ userName, password }),
        // JSON.stringify({email, password}),
        // requestData,
        {
          Headers: { "Content-Type": "application/json" },
          // withCredentials: true
        }
      );
      if (response.status === 200) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("Role_id", response.data.roleID)
      }

      console.log(JSON.stringify(response?.data));

      setIsLoading(false)
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      // // setAuth({userName, password, roles, accessToken});
      // setAuth({
      //   email,
      //   password
      // })
      // setUserName('');
      // setpassword('');
      // setSuccess(true);
      // sessionStorage.setItem('token', response.data.token);
      navigate("/");
    } catch (err) {
      setIsLoading(false)
      if(err.response.status === 401) {
        console.log(err.response.status)
        setLoginErrorMsg("Username atau password invalid.");
      } else {
        setLoginErrorMsg("Terjadi kesalahan pada sistem.")
      }
      console.error(err);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({
      name: "",
      password: "",
    })

    let valid = true;
    if(!userName){
      setErrors((prev) => ({
        ...prev,
        name: "Masukkan Username."
      }));
      valid= false;
    }
    if(!password){
      setErrors((prev) => ({
        ...prev,
        password: "Masukkan Password."
      }));
      valid = false;
    }
    
    if(valid){
      await handleLogin();
    }

  };

  return (
    <div>
      <div
        className="d-flex flex-column justify-content-center align-items-center bg-body-secondary background-image"
        style={{ minHeight: "100vh" }}
      >

        {
          loginErrorMsg &&
          <div className="position-absolute d-flex align-items-center card py-3 px-3 border-0 shadow custom-login-message" > 
            <div className="text-danger fw-semibold me-5">
              {loginErrorMsg}
            </div>
          </div>
        }

        <div className="login-box login-custom text-center">
          <div className="card-primary">
            <div className="card-body login-card-body bg-transparent">
              <h1 className="login-box-msg text-white mb-5 fw-light">
                Welcome Back!
              </h1>
              <form>
                <div className="input-group mb-4 d-flex flex-column">
                  <div>
                    <input
                      id="loginEmail"
                      type="email"
                      className="form-control rounded-pill py-2"
                      placeholder="Username"
                      onChange={(e) => setUserName(e.target.value)}
                      value={userName}
                    />
                  </div>
                  {
                    errors.name && <p className="text-start fw-semibold m-0 ps-3 login-form-error-custom">
                      {errors.name}
                    </p>
                  }
                  {/* <div className="input-group-text rounded-end-pill">
                  <FontAwesomeIcon className="me-1" icon={faUser}/>
                </div> */}
                </div>
                <div className="input-group mb-5 ">
                  <div className="d-flex position-relative align-items-center w-100">
                    <input
                      id="loginPassword"
                      type={isPasswordVisible? 'text' : 'password'}
                      className="form-control rounded-pill py-2"
                      placeholder="Password"
                      onChange={(e) => setpassword(e.target.value)}
                      value={password}
                    />
                    <button
                      className="position-absolute d-flex align-items-center"
                      style={{
                        right: '9px',
                        color: '#fff',
                        background:'transparent',
                        border: 'none'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsPasswordVisible(!isPasswordVisible)
                      }}
                    >
                      {
                        isPasswordVisible ? 
                        <FontAwesomeIcon icon={faEye}/>
                        :
                        <FontAwesomeIcon icon={faEyeSlash}/>
                      }
                    </button>
                  </div>
                  {
                    errors.password && <p className="ps-3 m-0 fw-semibold login-form-error-custom">
                      {errors.password}
                    </p>
                  }
                </div>
                {/*begin::Row*/}
                <div className="row">
                  {/* /.col */}
                  <div className="d-grid gap-2">
                    <button
                      id="loginButton"
                      type="submit"
                      onClick={handleSubmit}
                      className="py-2 rounded-pill"
                    >
                      {isLoading ?
                        <div className="spinner-border text-info" style={{height: "1rem", width: "1rem"}} role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                        :
                         'Log in' 
                      }
                    </button>
                  </div>
                  {/* /.col */}
                </div>
                {/*end::Row*/}
              </form>
            </div>
            {/* /.login-card-body */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
