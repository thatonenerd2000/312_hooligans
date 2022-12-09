import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Router
import { useNavigate } from "react-router-dom";

//Components
import ListingsComponenet from "../components/ListingsComponenet";
import Menu from "../components/Menu";

const Listing = () => {
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const [listings, getListings] = React.useState(["hi"]);

  const getListingsFromDB = () => {
    axios.get(`${Globalconfig.host}/getAllListings`).then((res) => {
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

  const buyNow = (itemId, buyerUsername) => {
    axios.post(`${Globalconfig.host}/buyNow`, {
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
    verifyToken();
    getListingsFromDB();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Menu />
      <div className="listings_page">
        {listings.map((listing) => {
          if (listing[9] !== "true") {
            return (
              <ListingsComponenet key={listing[0]} listing={listing}>
                {Globalconfig.name !== "" ? (
                  <div>
                    <button
                      onClick={(e) => {
                        addToCart(listing[0], Globalconfig.username);
                      }}
                    >
                      Add to cart
                    </button>
                    <button
                      onClick={(e) => {
                        buyNow(listing[0], Globalconfig.username);
                      }}
                    >
                      Buy Now!
                    </button>
                  </div>
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
          } else {
            return null;
          }
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
          onClick={() => {
            navigate("/auction");
          }}
        >
          Auctions
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
