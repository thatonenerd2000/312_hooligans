import React, { useState } from "react";

const AuctionComp = (props) => {
  const [bid, setBid] = useState(0);
  const [chat, setChat] = useState("");

  return (
    <div className="auction_comp">
      <div>
        <div style={{ float: "left", width: "350px" }}>
          <img src={props.listing[8]} alt="listing" id="listing_image" />
          <h1>{props.listing[3]}</h1>
          <h4>{props.listing[5]}</h4>
          <br />
          <hr />
          <h3>
            Highest Bid: $<strong>{props.price}</strong>
          </h3>
          <p>by {props.highestBidder}</p>
          <br />
          <input
            type="number"
            style={{ width: "300px" }}
            name="bidBox"
            id="bidBox"
            onChange={(e) => {
              setBid(e.target.value);
            }}
          />
          <br />
          <button
            onClick={(e) => {
              props.placeBid(bid);
            }}
          >
            Place Bid
          </button>
        </div>
        <div style={{ float: "right" }}>
          <div className="chatBox">
            <div style={{ marginTop: "10px" }}>
              <label htmlFor="chatBox">Chat: </label>
              <input
                style={{ width: "300px" }}
                name="chatBox"
                id="chatBox"
                onChange={(e) => {
                  setChat(e.target.value);
                }}
              />
              <button
                onClick={(e) => {
                  props.sendMessage(chat);
                }}
              >
                Send
              </button>
            </div>
            <div className="chatHistory">
              {props.chatHistory.map((message) => {
                return (
                  <p key={message}>
                    {message["username"]}: {message["message"]}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionComp;
