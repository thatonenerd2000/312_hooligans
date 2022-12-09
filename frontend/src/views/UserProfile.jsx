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

  const [listings, getListings] = React.useState([""]);

  const getListingsAxios = () => {
    axios.get(`${Globalconfig.host}/getListings/${Globalconfig.username}`).then((res) => {
      getListings(res.data);
    });
  };

  const verifyToken = () => {
    axios.get(`${Globalconfig.host}/verifyAuth`, { withCredentials: true }).then((res) => {
      if (res.data.message === "User verified successfully") {
        Globalconfig.setName(res.data.name);
        Globalconfig.setUsername(res.data.username);
        Globalconfig.setUserEmail(res.data.email);
      }
    });
  };

  useEffect(() => {
    verifyToken();
    getListingsAxios();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {Globalconfig.name !== "" ? (
        <div>
          <h1>Hello there {Globalconfig.name}, welcome to your profile</h1>
          <hr></hr>
          <h2>Your listings</h2>
          <hr />
          {listings.map((listing) => {
            return <ListingsComponenet listing={listing} />;
          })}
        </div>
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
