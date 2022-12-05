import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Router
import { useNavigate } from "react-router-dom";

//Components
import ListingsComponenet from "../components/ListingsComponenet";

const UserProfile = () => {
  const Globalconfig = useContext(ConfigContext);
  const navigate = useNavigate();

  const [listings, getListings] = React.useState("");

  const getListingsAxios = () => {
    axios.get(`${Globalconfig.host}/getListings/${Globalconfig.username}`).then((res) => {
      getListings(res.data);
    });
  };

  useEffect(() => {
    getListingsAxios();
  }, []);

  return (
    <div>
      {Globalconfig.name !== "" ? (
        <h1>Hello there {Globalconfig.name}, welcome to your profile</h1>
      ) : (
        <div>
          <h1>Please sign in to view your profile</h1>
          <button
            onClick={(e) => {
              navigate("/");
            }}
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
