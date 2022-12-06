import { RiShoppingCartFill } from "react-icons/ri";

//Router
import { useNavigate } from "react-router-dom";

const ShoppingCartButton = () => {
  let navigate = useNavigate();
  return (
    <button
      onClick={(e) => {
        navigate("/cart");
      }}
      id="shoppingCart"
    >
      <RiShoppingCartFill style={{ fontSize: "25px" }} />
    </button>
  );
};

export default ShoppingCartButton;