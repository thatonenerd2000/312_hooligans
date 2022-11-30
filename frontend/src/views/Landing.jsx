import { useState, useEffect } from "react";

//Components
import Logo from "../components/Logo.jsx";
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";

//Router
import { useNavigate } from "react-router-dom";

const Landing = () => {
  let navigate = useNavigate();
  const [logDisplay, setLogDisplay] = useState(true);

  useEffect(() => {}, [logDisplay]);

  return (
    <>
      <div className="Landing">
        <div className="logSign">
          <Logo size="70px" />
          <hr />
          <Login display={logDisplay ? "block" : "none"}>
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
            <br />
            <button
              onClick={() => {
                setLogDisplay(true);
              }}
            >
              Back to Log In
            </button>
          </Signup>
          <button
            id="guest_browse_button"
            onClick={() => {
              navigate("/listings");
            }}
          >
            Browse as Guest
          </button>
        </div>
      </div>
    </>
  );
};

export default Landing;
