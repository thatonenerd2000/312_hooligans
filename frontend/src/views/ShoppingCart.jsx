import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Router
import { useNavigate } from "react-router-dom";

//Components
import ListingsComponenet from "../components/ListingsComponenet";

const ShoppingCart = () => {
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const [cartItems, getCartItems] = React.useState([]);

  const getItem = (itemId) => {
    axios.get(`${Globalconfig.host}/getListing/${itemId}`).then((res) => {
      getCartItems((prev) => [...prev, res.data]);
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

  const getCartIds = () => {
    axios.get(`${Globalconfig.host}/getCart/${Globalconfig.username}`).then((res) => {
      const carts = res.data;
      // eslint-disable-next-line
      carts.map((cart) => {
        getItem(cart[2]);
      });
    });
  };

  useEffect(() => {
    verifyToken();
    getCartIds();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>Shopping Cart</h1>
      <hr />
      {cartItems.map((item) => {
        return <ListingsComponenet key={item[0]} listing={item} />;
      })}
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
