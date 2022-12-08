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
  const [purchases, getUserPurchases] = React.useState([""]);

  const getListingsAxios = () => {
    axios.get(`${Globalconfig.host}/getListings/${Globalconfig.username}`).then((res) => {
      getListings(res.data);
    });
  };
  const getUserPurchasesAxios = () => {
    axios.get(`${Globalconfig.host}/getUserPurchases/${Globalconfig.username}`).then((res) => {
      getUserPurchases(res.data);
    });
  };

  useEffect(() => {
    getListingsAxios();
    getUserPurchasesAxios();
    console.log(purchases);
    // eslint-disable-next-line
  },[]);

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
                <ListingsComponenet listing={listing}>
                  {listing[9] === "true" ? (
                    <div id="soldSign">
                      <h1>SOLD</h1>
                    </div>
                  ) : (
                    <>
                      <button id="setAuction">
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
            <hr></hr>
              <h2>Purchased Items</h2>
            <hr />
            {purchases.map((listing) => {
              return (<ListingsComponenet listing = {listing}></ListingsComponenet>);
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
