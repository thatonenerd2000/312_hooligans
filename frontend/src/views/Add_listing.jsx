import React, { useContext, useEffect } from "react";
import axios from "axios";

//Components
import NewItem from "../components/NewItem.jsx";

//Context
import { ConfigContext } from "../GlobalContext";

const Add_listing = () => {
  const Globalconfig = useContext(ConfigContext);

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
    // eslint-disable-next-line
  }, []);

  return (
    <div className="add_listing">
      <NewItem />
    </div>
  );
};

export default Add_listing;
