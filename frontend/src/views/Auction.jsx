import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//Components
import AuctionComp from "../components/AuctionComp";

const Auction = () => {
  const Globalconfig = useContext(ConfigContext);

  const [chatHistory, setChatHistory] = useState([]);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
  const [ws, setWs] = useState();

  const getItemFromAuction = () => {
    axios.get(`${Globalconfig.host}/getAuction`).then((res) => {
      Globalconfig.setAuctionLists(res.data);
    });
  };

  useEffect(() => {
    getItemFromAuction();
    let listingIds = [];
    Globalconfig.auctionLists.forEach((listing) => {
      listingIds.push(listing[0]);
    });
    const url = `ws://localhost:8000/ws/auction/${listingIds[0]}/`;
    const ws = new WebSocket(url);
    setWs(ws);
    ws.onmessage = (e) => {
      const WSmessage = JSON.parse(e.data);
      if (WSmessage.messageType === "chat") {
        if (chatHistory.length === 0) {
          setChatHistory([WSmessage]);
        } else {
          setChatHistory([...chatHistory, WSmessage]);
        }
      } else if (WSmessage.messageType === "bid") {
        if (parseInt(WSmessage.message) > parseInt(highestBid)) {
          setHighestBidder(WSmessage.username);
          setHighestBid(WSmessage.message);
        }
      }
    };
    console.log(chatHistory);
    // eslint-disable-next-line
  }, [chatHistory, highestBid, Globalconfig.setAuctionLists]);

  return (
    <div id="auction_page">
      {Globalconfig.auctionLists.map((listing) => {
        return (
          <div key={listing}>
            <AuctionComp
              highestBidder={highestBidder}
              price={highestBid}
              key={listing[0]}
              chatHistory={chatHistory}
              listing={listing}
              sendMessage={(e) => {
                let data = {
                  messageType: "chat",
                  message: e,
                  listingId: listing[0],
                  username: Globalconfig.username,
                };
                ws.send(JSON.stringify(data));
              }}
              placeBid={(e) => {
                let data = {
                  messageType: "bid",
                  message: e,
                  listingId: listing[0],
                  username: Globalconfig.username,
                };
                ws.send(JSON.stringify(data));
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Auction;
