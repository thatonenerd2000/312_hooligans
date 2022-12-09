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

  const getAuctions = () => {
    axios.get(`${Globalconfig.host}/getAuction`).then((res) => {
      Globalconfig.setAuctionLists(res.data);
    });
  };

  useEffect(() => {
    verifyToken();
    getListingsFromDB();
    getAuctions();
    // eslint-disable-next-line
  }, [Globalconfig.username, Globalconfig.name, Globalconfig.email]);

  return (
    <>
      <Menu />
      <div className="listings_page">
        <h1 className="headers">Listings</h1>
        <hr />
        {listings.map((listing) => {
          if (listing[9] !== "true") {
            return (
              <>
                <ListingsComponenet key={listing[0]} listing={listing} price="">
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
              </>
            );
          } else {
            return null;
          }
        })}
        <br />
        <br />
        <hr />
        <h1 className="headers">Current Auctions</h1>
        <hr />
        {Globalconfig.auctionLists.map((auction) => {
          return (
            <ListingsComponenet key={auction[0]} listing={auction} price="Auctin is LIVE! $">
              <button
                onClick={(e) => {
                  navigate(`/auction/${auction[0]}`);
                }}
                id="setAuction"
              >
                <h1>Go to Auction</h1>
              </button>
            </ListingsComponenet>
          );
        })}
      </div>
    </>
  );
};

export default Listing;
