import { useState, useEffect } from "react";

//Components
import Logo from "../components/Logo.jsx";
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";

const Landing = () => {
  const [logDisplay, setLogDisplay] = useState(true);

  useEffect(() => {}, [logDisplay]);

  return (
    <>
      <div className="Landing">
        <div className="logSign">
          <Logo size="70px" />
          <hr />
          <Login display={logDisplay ? "block" : "none"}>
            <button>Log In</button>
            <br />
            <button
              onClick={() => {
                setLogDisplay(false);
              }}
            >
              Create an Account
            </button>
          </Login>
          <Signup display={!logDisplay ? "block" : "none"}>
            <button>Create Account</button>
            <br />
            <button
              onClick={() => {
                setLogDisplay(true);
              }}
            >
              Back to Log In
            </button>
          </Signup>
          <button id="guest_browse_button">Browse as Guest</button>
        </div>
      </div>
    </>
  );
};

export default Landing;
