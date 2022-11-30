import React from "react";

//Context
export const ConfigContext = React.createContext();

const GlobalContext = (props) => {
  const [username, setUsername] = React.useState();
  const [userEmail, setUserEmail] = React.useState();
  //Chane it to 8000 for dev and 8080 for prod
  const [host, setHost] = React.useState("http://localhost:8080");
  return (
    <ConfigContext.Provider
      value={{
        username: username,
        setUsername,
        userEmail: userEmail,
        setUserEmail,
        host: host,
        setHost,
      }}
    >
      {props.children}
    </ConfigContext.Provider>
  );
};

export default GlobalContext;
