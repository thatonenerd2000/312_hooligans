import React, { useContext, useEffect, useState } from "react";

//Context
import { ConfigContext } from "../GlobalContext";

const Auction = () => {
  const Globalconfig = useContext(ConfigContext);
  const [messages, setMessages] = useState("");
  const [ws, setWs] = useState();

  useEffect(() => {
    const url = `ws://localhost:${Globalconfig.port}/ws`;
    const ws = new WebSocket(url);
    setWs(ws);
    ws.onmessage = (e) => {
      const WSmessage = JSON.parse(e.data);
      console.log(e);
      setMessages([...messages, WSmessage]);
    };
    // eslint-disable-next-line
  }, [messages]);

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
            message: messages,
          };
          ws.send(message);
        }}
      >
        Send
      </button>
      <div id="messages"></div>
    </div>
  );
};

export default Auction;
