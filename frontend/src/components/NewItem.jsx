import React, { useContext } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//images
import addImage from "../assets/images/add.png";

//Router
import { useNavigate } from "react-router-dom";

const NewItem = () => {
  const Globalconfig = useContext(ConfigContext);
  let navigate = useNavigate();

  const add_listing = (username, name, itemName, description, itemType, price, location, image) => {
    axios.post(`${Globalconfig.host}/addListing`, {
      username: username,
      name: name,
      itemName: itemName,
      description: description,
      itemType: itemType,
      price: price,
      location: location,
      image: image,
    });
  };

  const [image, setImageBinary] = React.useState();
  const [ItemName, setItemName] = React.useState();
  const [ItemDescription, setItemDescription] = React.useState();
  const [ItemType, setItemType] = React.useState();
  const [ItemPrice, setItemPrice] = React.useState();
  const [ItemLocation, setItemLocation] = React.useState();

  return (
    <div className="add_listing">
      <div className="add_listing_box">
        <img
          src={addImage}
          alt="add"
          onClick={() => {
            document.getElementById("add_listing_image_input").click();
          }}
          id="add_listing_image"
        />
        <input
          type="file"
          id="add_listing_image_input"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
              setImageBinary(reader.result);
            };
          }}
        />
        <br></br>
        <input
          type="text"
          placeholder="Title"
          id="add_listing_title"
          onChange={(e) => {
            setItemName(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Description"
          id="add_listing_description"
          onChange={(e) => {
            setItemDescription(e.target.value);
          }}
        />
        <select
          id="add_listing_category"
          onChange={(e) => {
            setItemType(e.target.value);
          }}
        >
          <option value="Other">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Price"
          id="itemLocation"
          onChange={(e) => {
            setItemPrice(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Price"
          id="add_listing_price"
          onChange={(e) => {
            setItemLocation(e.target.value);
          }}
        />
        <button
          onClick={() => {
            // Make sure all fields are filled out //

            add_listing(
              Globalconfig.username,
              Globalconfig.name,
              ItemName,
              ItemDescription,
              ItemType,
              ItemPrice,
              ItemLocation,
              image
            );
          }}
        >
          SALE!
        </button>
        <button
          onClick={() => {
            navigate("/listings");
          }}
        >
          Back to listings
        </button>
      </div>
    </div>
  );
};

export default NewItem;
