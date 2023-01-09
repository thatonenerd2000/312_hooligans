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
  const [NewTime, setNewTime] = useState("");
  const [timeLeftDiff, setTimeLeft] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const getItemFromAuction = () => {
    axios.post(`${Globalconfig.host}/getAuctionItem/${itemId}`).then((res) => {
      setItem(res.data.item);
    });
  };

  const verifyToken = () => {
    axios
      .get(
        `${Globalconfig.host}/verifyAuth`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.message === "User verified successfully") {
          Globalconfig.setName(res.data.name);
          Globalconfig.setUsername(res.data.username);
          Globalconfig.setUserEmail(res.data.email);
        }
      });
  };

  const getBidInfo = (itemId) => {
    axios.get(`${Globalconfig.host}/getAuctionItem/${itemId}`).then((res) => {
      setHighestBid(res.data[2]);
      setHighestBidder(res.data[3]);
      setNewTime(res.data[4]);
      setExpiryTime(res.data[4]);
    });
  };

  const updateBidInfo = (itemId, currentBid, currentBidder) => {
    axios.post(`${Globalconfig.host}/updateAuction/${itemId}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      currentBid: currentBid,
      currentBidder: currentBidder,
    });
  };

  const timeLeft = (timeFuture) => {
    const timeNow = new Date();
    const timeFutureDate = new Date(timeFuture);
    const timeLeft = timeFutureDate - timeNow;
    const minutes = Math.floor(timeLeft / (1000 * 60));
    setTimeLeft(`${minutes}m`);
  };

  const endAuction = (itemId) => {
    axios.post(`${Globalconfig.host}/endAuction/${itemId}`);
  };

  useEffect(() => {
    verifyToken();
    getBidInfo(itemId);
    timeLeft(NewTime);
    console.log(timeLeftDiff);
    if (timeLeftDiff === "0m") {
      endAuction(itemId);
    }

    const url = `ws://localhost:${Globalconfig.port}/ws/auction/${itemId}`;
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
        setHighestBidder(WSmessage.username);
        setHighestBid(WSmessage.message);
      }
    };
    // eslint-disable-next-line
  }, [chatHistory, highestBid, Globalconfig.username, Globalconfig.name, Globalconfig.email, NewTime, timeLeftDiff]);

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
            timeLeft={timeLeftDiff}
            sendMessage={(e) => {
              let data = {
                messageType: "chat",
                message: e,
                listingId: item[0],
                username: Globalconfig.username,
                timeNow: new Date(),
                timeExpire: expiryTime,
              };
              ws.send(JSON.stringify(data));
            }}
            placeBid={(e) => {
              let data = {
                messageType: "bid",
                message: e,
                listingId: item[0],
                username: Globalconfig.username,
                timeNow: new Date(),
                timeExpire: expiryTime,
              };
              ws.send(JSON.stringify(data));
              updateBidInfo(itemId, e, Globalconfig.username);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Auction;
