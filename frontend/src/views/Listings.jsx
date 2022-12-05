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
        return <ListingsComponenet listing={listing} />;
      })}
      <button
        onClick={() => {
          navigate("/add_listing");
        }}
      >
        Go to your listings
      </button>
    </div>
  );
};

export default Listing;
