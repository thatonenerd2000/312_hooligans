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
    axios
      .post(`${Globalconfig.host}/verifyUser`, {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.message === "User verified successfully") {
          Globalconfig.setUsername(res.data.name);
          Globalconfig.setUserEmail(res.data.email);
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
        placeholder="email"
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
