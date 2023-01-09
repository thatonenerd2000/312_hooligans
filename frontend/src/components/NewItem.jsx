import React, { useContext, useEffect } from "react";
import axios from "axios";

//Context
import { ConfigContext } from "../GlobalContext";

//images
import addImage from "../assets/images/add.png";

const NewItem = () => {
  const Globalconfig = useContext(ConfigContext);

  const [imgSrc, setImgSrc] = React.useState(addImage);

  const add_listing = (username, name, itemName, description, itemType, price, location, image) => {
    axios.post(
      `${Globalconfig.host}/addListing`,
      {
        username: username,
        name: name,
        itemName: itemName,
        description: description,
        itemType: itemType,
        price: price,
        location: location,
        image: image,
      },
      { withCredentials: true }
    );
  };

  const [image, setImageBinary] = React.useState();
  const [ItemName, setItemName] = React.useState();
  const [ItemDescription, setItemDescription] = React.useState();
  const [ItemType, setItemType] = React.useState();
  const [ItemPrice, setItemPrice] = React.useState();
  const [ItemLocation, setItemLocation] = React.useState();

  useEffect(() => {}, [imgSrc]);

  return (
    <div className="add_listing_box">
      <img
        style={{ width: "200px" }}
        src={imgSrc}
        alt="add"
        onClick={() => {
          document.getElementById("add_listing_image_input").click();
        }}
        id="add_listing_image"
      />
      <br />
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
          setImgSrc(URL.createObjectURL(file));
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
      <br />
      <input
        type="text"
        placeholder="Description"
        id="add_listing_description"
        onChange={(e) => {
          setItemDescription(e.target.value);
        }}
      />
      <br />
      <select
        id="add_listing_category"
        onChange={(e) => {
          setItemType(e.target.value);
        }}
      >
        <option value="Other">Item Type</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Furniture">Furniture</option>
        <option value="Books">Books</option>
        <option value="Other">Other</option>
      </select>
      <br />
      <input
        type="text"
        placeholder="Price"
        id="add_listing_price"
        onChange={(e) => {
          setItemPrice(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        placeholder="Location"
        id="itemLocation"
        onChange={(e) => {
          setItemLocation(e.target.value);
        }}
      />
      <br />
      <button
        id="add_listing_sale_button"
        onClick={() => {
          if (
            ItemName !== "" &&
            ItemDescription !== "" &&
            ItemPrice !== "" &&
            ItemLocation !== "" &&
            image != null &&
            (ItemType === "Other" ||
              ItemType === "Electronics" ||
              ItemType === "Clothing" ||
              ItemType === "Furniture" ||
              ItemType === "Books")
          ) {
            add_listing(
              Globalconfig.username,
              Globalconfig.name,
              ItemName,
              ItemDescription,
              ItemType,
              ItemPrice,
              ItemLocation,
              image,
              ""
            );
            setImageBinary(null);
            setItemName("");
            setItemDescription("");
            setItemType("");
            setItemPrice("");
            setItemLocation("");
            setImgSrc(addImage);
          } else {
            window.alert("One or more fields empty");
          }
        }}
      >
        SALE!
      </button>
    </div>
  );
};

export default NewItem;
