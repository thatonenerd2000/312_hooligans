import axios from "axios";
import React, { useState, useContext } from "react";

//Router
import { useNavigate } from "react-router-dom";

//Context
import { ConfigContext } from "../GlobalContext";

const Login = (props) => {
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const verifyUser = (email, password) => {
    let username = email.split("@")[0];
    axios
      .post(
        `${Globalconfig.host}/verifyUser`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin":
              "http://localhost, http://localhost:3000, http://localhost:8000 , http://localhost:8080 , http://localhost:3001 , http://frontend:3000, http://frontend:3001, http://backend:8000, http://backend:8080, http://206.81.9.249/, 206.81.9.249, ws://206.81.9.249:*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
          email: username,
          password: password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.message === "User verified successfully") {
          Globalconfig.setName(res.data.name);
          Globalconfig.setUsername(res.data.username);
          Globalconfig.setUserEmail(res.data.email);
          navigate("/listings");
        }
      });
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="login_container"
      style={{
        display: props.display,
      }}
    >
      <h2>Log In</h2>
      <input
        type="text"
        placeholder="email or username"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <br />
      <button
        onClick={() => {
          verifyUser(email, password);
        }}
      >
        Log In
      </button>
      {props.children}
    </div>
  );
};

export default Login;
