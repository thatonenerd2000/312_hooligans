import React, { useContext } from "react";

// Context
import { ConfigContext } from "../GlobalContext";

//Router
import { useNavigate } from "react-router-dom";

const ListingsComponenet = (props) => {
  const Globalconfig = useContext(ConfigContext);

  let navigate = useNavigate();

  return (
    <div className="listing">
      <div style={{ textAlign: "center" }}>
        <img src={props.listing[8]} alt="listing" id="listing_image" />
      </div>
      <br />
      <h2>{props.listing[3]}</h2>
      <p>{props.listing[4]}</p>
      <hr />
      <p>
        <strong>Description:</strong> {props.listing[5]}
      </p>
      <p>
        <strong>Price:</strong> ${props.listing[6]}
      </p>
      <p>
        <strong>Location:</strong> {props.listing[7]}
      </p>
      <br />
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
    </div>
  );
};

export default ListingsComponenet;
