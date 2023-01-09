import axios from "axios";
import React, { useState, useContext } from "react";
//Router
import { useNavigate } from "react-router-dom";

//Context
import { ConfigContext } from "../GlobalContext";

const Signup = (props) => {
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.headers.common["Access-Control-Allow-Credentials"] = true;
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axios.defaults.headers.common["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,PATCH,OPTIONS";
  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const createUser = (name, email, password) => {
    axios
      .post(
        `${Globalconfig.host}/createUser`,
        {
          name: name,
          email: email,
          password: password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.message === "User created successfully") {
          Globalconfig.setUsername(email.split("@")[0]);
          Globalconfig.setUserEmail(email);
          navigate("/listings");
        }
      });
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div
      className="signup_container"
      style={{
        display: props.display,
      }}
    >
      <h2>Sign up</h2>
      <input
        type="text"
        placeholder="First Name"
        onChange={(e) => {
          setFirstName(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        placeholder="Last Name"
        onChange={(e) => {
          setLastName(e.target.value);
        }}
      />
      <br />
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
      <input
        type="password"
        placeholder="confirm password"
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      />
      <br />
      <button
        onClick={() => {
          if (firstName !== "" && lastName !== "" && email.includes("@") && password === confirmPassword) {
            Globalconfig.setUsername(email.split("@")[0]);
            Globalconfig.setName(firstName + " " + lastName);
            createUser(firstName + " " + lastName, email, password);
          } else if (firstName === "") {
            window.alert("Please fill out first name");
          } else if (lastName === "") {
            window.alert("Please fill out last name");
          } else if (!email.includes("@")) {
            window.alert("Please fill out a valid email");
          } else {
            window.alert("One or more fields wrong");
          }
        }}
      >
        Create Account
      </button>
      {props.children}
    </div>
  );
};

export default Signup;
