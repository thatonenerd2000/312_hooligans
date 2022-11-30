import React, { useContext } from "react";

//Context
import { ConfigContext } from "../GlobalContext";

const Listing = () => {
  const Globalconfig = useContext(ConfigContext);

  return (
    <div>
      <h1>Hello there {Globalconfig.username}, welcome to the listings page</h1>
    </div>
  );
};

export default Listing;
