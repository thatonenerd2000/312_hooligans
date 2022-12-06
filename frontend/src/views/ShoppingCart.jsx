import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Router
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const [cartItems, getCartItems] = React.useState(["hi"]);

  const getCart = () => {
    axios.get(`${Globalconfig.host}/getCart/${Globalconfig.username}`).then((res) => {
      getCartItems(res.data);
    });
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <hr />
      <button
        onClick={(e) => {
          navigate("/listings");
        }}
      >
        Back to Listings
      </button>
    </div>
  );
};

export default ShoppingCart;