import axios from "axios";
import React, { useState, useContext } from "react";

//Router
import { useNavigate } from "react-router-dom";

//Context
import { ConfigContext } from "../GlobalContext";

const Signup = (props) => {
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const createUser = (name, email, password) => {
    axios
      .post(`${Globalconfig.host}/createUser`, {
        name: name,
        email: email,
        password: password,
      })
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
          if (password === confirmPassword) {
            createUser(firstName + " " + lastName, email, password);
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
