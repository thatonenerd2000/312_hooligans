import { RiShoppingCartFill } from "react-icons/ri";
import { FaThList } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { GrAdd } from "react-icons/gr";

//Router
import { useNavigate } from "react-router-dom";

const Menu = () => {
  let navigate = useNavigate();
  return (
    <div id="MenuButtonsContainer">
      <button
        className="MenuButton"
        onClick={(e) => {
          navigate("/add_listing");
        }}
      >
        <GrAdd style={{ fontSize: "25px" }} />
      </button>
      <br />
      <button
        className="MenuButton"
        onClick={(e) => {
          navigate("/profile");
        }}
      >
        <CgProfile style={{ fontSize: "25px" }} />
      </button>
      <br />
      <button
        className="MenuButton"
        onClick={(e) => {
          navigate("/listings");
        }}
      >
        <FaThList style={{ fontSize: "25px" }} />
      </button>
      <br />
      <button
        className="MenuButton"
        onClick={(e) => {
          navigate("/cart");
        }}
      >
        <RiShoppingCartFill style={{ fontSize: "25px" }} />
      </button>
    </div>
  );
};

export default Menu;
