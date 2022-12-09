import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

const Auction = () => {
  const Globalconfig = useContext(ConfigContext);
  const [messages, setMessages] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [ws, setWs] = useState();

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
    const ws = new WebSocket(url);
    setWs(ws);
    ws.onmessage = (e) => {
      const WSmessage = JSON.parse(e.data);
      if (chatHistory.length === 0) {
        setChatHistory([WSmessage]);
      } else {
        setChatHistory([...chatHistory, WSmessage]);
      }
      console.log(chatHistory);
    };
    // eslint-disable-next-line
  }, [chatHistory]);

  return (
    <div>
      <label htmlFor="chat">Message</label>
      <input
        type="text"
        name="chat"
        onChange={(e) => {
          setMessages(e.target.value);
        }}
      ></input>
      <button
        onClick={(e) => {
          const message = {
            username: Globalconfig.username,
            message: messages,
          };
          ws.send(JSON.stringify(message));
        }}
      >
        Send
      </button>
      <div id="messages">
        {chatHistory.map((message) => {
          return (
            <div>
              <p>
                {message.username}:{message.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Auction;
