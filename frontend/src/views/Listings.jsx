import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Router
import { useNavigate } from "react-router-dom";

//Components
import ListingsComponenet from "../components/ListingsComponenet";

const Listing = () => {
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const [listings, getListings] = React.useState(["hi"]);

  const getListingsFromDB = () => {
    axios.get(`${Globalconfig.host}/getAllListings`).then((res) => {
      getListings(res.data);
    });
  };

  useEffect(() => {
    getListingsFromDB();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="listings_page">
      {Globalconfig.name !== "" ? (
        <h1>Hello there {Globalconfig.name}, welcome to the listings page</h1>
      ) : (
        <h1>Welcome to the listings page</h1>
      )}
      {listings.map((listing) => {
        return (
          <ListingsComponenet listing={listing}>
            {Globalconfig.name !== "" ? (
              <button>Buy</button>
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
  );
};

export default Listing;
