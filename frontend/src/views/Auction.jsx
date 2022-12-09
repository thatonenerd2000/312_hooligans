import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

//Context
import { ConfigContext } from "../GlobalContext";

//Components
import AuctionComp from "../components/AuctionComp";
import Menu from "../components/Menu";

const Auction = () => {
  const Globalconfig = useContext(ConfigContext);

  const params = useParams();

  const itemId = params.itemId;
  const [item, setItem] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
  const [ws, setWs] = useState();
  const [timeLeft, setTimeLeft] = useState("");

  const getItemFromAuction = () => {
    axios.post(`${Globalconfig.host}/getAuctionItem/${itemId}`).then((res) => {
      setItem(res.data.item);
      setTimeLeft(res.data.expiryTime);
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

  useEffect(() => {
    verifyToken();
    const url = `ws://localhost:${Globalconfig.port}/ws`;
    getItemFromAuction();
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
    // eslint-disable-next-line
  }, [chatHistory, highestBid]);

  return (
    <>
      <Menu />
      <div id="auction_page">
        <div>
          <AuctionComp
            highestBidder={highestBidder}
            price={highestBid}
            key={item[0]}
            chatHistory={chatHistory}
            listing={item}
            timeLeft={timeLeft}
            sendMessage={(e) => {
              let data = {
                messageType: "chat",
                message: e,
                listingId: item[0],
                username: Globalconfig.username,
              };
              ws.send(JSON.stringify(data));
            }}
            placeBid={(e) => {
              let data = {
                messageType: "bid",
                message: e,
                listingId: item[0],
                username: Globalconfig.username,
              };
              ws.send(JSON.stringify(data));
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Auction;
