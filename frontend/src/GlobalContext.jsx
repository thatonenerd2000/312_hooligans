import React from "react";

//Context
export const ConfigContext = React.createContext();

const GlobalContext = (props) => {
  const [username, setUsername] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [auctionLists, setAuctionLists] = React.useState([]);
  //Chane it to 8000 for dev and 8080 for prod
  const [port, setPort] = React.useState("8080");
  const [host, setHost] = React.useState(`http://localhost:${port}`);
  const [token, setToken] = React.useState("");
  return (
    <ConfigContext.Provider
      value={{
        name: name,
        setName,
        username: username,
        setUsername,
        userEmail: userEmail,
        setUserEmail,
        host: host,
        port: port,
        setHost,
        setPort,
        token,
        setToken,
        auctionLists: auctionLists,
        setAuctionLists,
      }}
    >
      {props.children}
    </ConfigContext.Provider>
  );
};

export default GlobalContext;
