import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Components
import ListingsComponenet from "../components/ListingsComponenet";
import Menu from "../components/Menu.jsx";

const ShoppingCart = () => {
  const Globalconfig = useContext(ConfigContext);

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
  const removeItem = (itemId, buyerUsername) => {
    axios.post(`${Globalconfig.host}/removeOne`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      itemId: itemId,
      buyerUsername: buyerUsername,
    });
  };
  const checkoutAll = () => {
    axios.post(`${Globalconfig.host}/checkoutCart`, {
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      username: Globalconfig.username,
    });
  };

  useEffect(() => {
    verifyToken();
    getCartIds();
    // eslint-disable-next-line
  }, [Globalconfig.username, Globalconfig.name, Globalconfig.email]);

  return (
    <div id="shopping_cart">
      <Menu />
      <h1 className="headers">Your Cart</h1>
      <hr />
      {cartItems.map((item) => {
        return (
          <ListingsComponenet key={item[0]} listing={item} price="">
            <button
              onClick={(e) => {
                removeItem(item[0], Globalconfig.username);
                window.location.reload();
              }}
            >
              Remove From Cart
            </button>
          </ListingsComponenet>
        );
      })}
      <br />
      <button
        id="checkout_button"
        onClick={(e) => {
          checkoutAll(Globalconfig.username);
        }}
      >
        Checkout Cart!
      </button>
    </div>
  );
};

export default ShoppingCart;
