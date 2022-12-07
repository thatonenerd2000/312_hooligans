import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Router
import { useNavigate } from "react-router-dom";

//Components
import ListingsComponenet from "../components/ListingsComponenet";
import ShoppingCartButton from "../components/ShoppingCartButton";

const Listing = () => {
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const [listings, getListings] = React.useState(["hi"]);

  const getListingsFromDB = () => {
    axios.get(`${Globalconfig.host}/getAllListings`).then((res) => {
      getListings(res.data);
    });
  };

  const addToCart = (itemId, buyerUsername) => {
    axios.post(`${Globalconfig.host}/addToCart`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      itemId: itemId,
      buyerUsername: buyerUsername,
    });
  };

  useEffect(() => {
    getListingsFromDB();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ShoppingCartButton />
      <div className="listings_page">
        {/* {Globalconfig.name !== "" ? (
        <h1>Hello there {Globalconfig.name}, welcome to the listings page</h1>
      ) : (
        <h1>Welcome to the listings page</h1>
      )} */}
        {listings.map((listing) => {
          return (
            <ListingsComponenet key={listing[0]} listing={listing}>
              {Globalconfig.name !== "" ? (
                <button
                  onClick={(e) => {
                    addToCart(listing[0], Globalconfig.username);
                  }}
                >
                  Add to cart
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    navigate("/");
                  }}
                >
                  Sign in to buy
                </button>
              )}
            </ListingsComponenet>
          );
        })}
        <button onClick={(e) => navigate("/cart")}>Shopping Cart</button>
        <button
          onClick={() => {
            navigate("/add_listing");
          }}
        >
          Add listings
        </button>
        <button
          onClick={(e) => {
            navigate("/profile");
          }}
        >
          Your profile
        </button>
      </div>
    </>
  );
};

export default Listing;
