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
      .post(`${Globalconfig.host}/verifyUser`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
        email: username,
        password: password,
      })
      .then((res) => {
        if (res.data.message === "User verified successfully") {
          Globalconfig.setUsername(res.data.username);
          Globalconfig.setUserEmail(res.data.email);
          Globalconfig.setName(res.data.name);
          navigate("/listings");
        } else {
          alert("Incorrect email or password");
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
