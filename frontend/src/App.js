//Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Views
import Landing from "./views/Landing.jsx";

//Styles
import "./style.scss";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
