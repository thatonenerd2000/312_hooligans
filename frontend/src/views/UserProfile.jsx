import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Router
import { useNavigate } from "react-router-dom";

//Components
import ListingsComponenet from "../components/ListingsComponenet";
import Menu from "../components/Menu.jsx";

//Icons
import { BsFillTrashFill } from "react-icons/bs";

const UserProfile = () => {
  const Globalconfig = useContext(ConfigContext);
  const navigate = useNavigate();

  const [listings, getListings] = React.useState([""]);
  const [bought, setBought] = React.useState([]);

  const getListingsAxios = () => {
    axios.get(`${Globalconfig.host}/getListings/${Globalconfig.username}`).then((res) => {
      getListings(res.data);
    });
  };

  const getListingsBought = () => {
    axios.get(`${Globalconfig.host}/getListingsBought/${Globalconfig.username}`).then((res) => {
      setBought(res.data);
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

  const createAuction = (itemID) => {
    axios.post(`${Globalconfig.host}/createAuction/${itemID}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          "http://localhost, http://localhost:3000, http://localhost:8000 , http://localhost:8080 , http://localhost:3001 , http://frontend:3000, http://frontend:3001, http://backend:8000, http://backend:8080, http://206.81.9.249/, 206.81.9.249, ws://206.81.9.249:*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      startingPrice: 0,
      highestBid: 0,
      highestBidder: "NULL",
    });
  };

  useEffect(() => {
    verifyToken();
    getListingsAxios();
    getListingsBought();
    console.log(bought);
    // eslint-disable-next-line
  }, [Globalconfig.auctionLists, Globalconfig.username, Globalconfig.name, Globalconfig.email]);

  return (
    <>
      <Menu />
      <div id="user_profile">
        {Globalconfig.name !== "" ? (
          <div>
            <div id="user_profile_greet">
              <h1>Hello there {Globalconfig.name}, welcome to your profile</h1>
              <hr></hr>
              <h2>Your listings</h2>
              <hr />
            </div>
            {listings.map((listing) => {
              return (
                <ListingsComponenet key={listing[0]} listing={listing} price="">
                  {listing[9] === "true" ? (
                    <div id="soldSign">
                      <h1>SOLD</h1>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          createAuction(listing[0]);
                          Globalconfig.setAuctionLists((prev) => [...prev, listing]);
                          navigate(`/auction/${listing[0]}`);
                        }}
                        id="setAuction"
                      >
                        <h1>Set For Auction</h1>
                      </button>
                      <button id="deleteListing">
                        <h1>
                          <BsFillTrashFill />
                        </h1>
                      </button>
                    </>
                  )}
                </ListingsComponenet>
              );
            })}
            <br />
            <h1 className="headers">Your purchases</h1>
            <hr />
            {bought.map((listing) => {
              return <ListingsComponenet key={listing[0]} listing={listing} price="" />;
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
    </>
  );
};

export default UserProfile;
