//Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Views
import Landing from "./views/Landing.jsx";
import Listings from "./views/Listings.jsx";

//Global Context
import GlobalContext from "./GlobalContext";

//Styles
import "./style.scss";

const App = () => {
  return (
    <>
      <GlobalContext>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/listings" element={<Listings />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext>
    </>
  );
};

export default App;
