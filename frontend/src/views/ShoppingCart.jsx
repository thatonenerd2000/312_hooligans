import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Router
import { useNavigate } from "react-router-dom";

//Components
import ListingsComponenet from "../components/ListingsComponenet";
import Menu from "../components/Menu.jsx";

const ShoppingCart = () => {
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const [cartItems, getCartItems] = React.useState([]);

  const getItem = (itemId) => {
    axios.get(`${Globalconfig.host}/getListing/${itemId}`).then((res) => {
      getCartItems((prev) => [...prev, res.data]);
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
        "Content-Type" : "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      },
      username : Globalconfig.username
    });
  }

  useEffect(() => {
    getCartIds();
    // eslint-disable-next-line
  }, []);

  return (
    <div id="shopping_cart">
      <Menu />
      <h1>Your Cart</h1>
      <hr />
      {cartItems.map((item) => {
        return (<ListingsComponenet key={item[0]} listing={item}> 
        <button
          onClick={(e) => {
            removeItem(item[0], Globalconfig.username);
            }}
            >
              Remove From Cart
              </button>
        </ListingsComponenet>);
      })}
      <button
        onClick={(e) => {
          navigate("/listings");
        }}
      >
        Back to Listings
      </button>
      <button
      onClick={(e) => {
        checkoutAll(Globalconfig.username)
      }}
      >
        Checkout Cart!
      </button>
    </div>
  );
};

export default ShoppingCart;
