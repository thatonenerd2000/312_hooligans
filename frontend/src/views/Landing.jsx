import { useState, useEffect, useContext } from "react";
import axios from "axios";

//Components
import Logo from "../components/Logo.jsx";
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";

//Router
import { useNavigate } from "react-router-dom";

//Context
import { ConfigContext } from "../GlobalContext";

const Landing = () => {
  let navigate = useNavigate();
  const [logDisplay, setLogDisplay] = useState(true);
  const Globalconfig = useContext(ConfigContext);

  const verifyToken = () => {
    axios.get(`${Globalconfig.host}/verifyAuth`, { withCredentials: true }).then((res) => {
      if (res.data.message === "User verified successfully") {
        Globalconfig.setName(res.data.name);
        Globalconfig.setUsername(res.data.username);
        Globalconfig.setUserEmail(res.data.email);
        navigate("/listings");
      }
    });
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line
  }, [logDisplay, Globalconfig.username, Globalconfig.name, Globalconfig.email]);

  return (
    <>
      <div className="Landing">
        <div className="logSign">
          <Logo size="70px" />
          <hr />
          <Login display={logDisplay ? "block" : "none"}>
            <br />
            <button
              onClick={(e) => {
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
