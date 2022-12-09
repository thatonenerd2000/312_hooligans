const ListingsComponenet = (props) => {
  return (
    <>
      <div className="listing" style={{ backgroundColor: props.bg === "" ? "white" : props.bg }}>
        <div style={{ textAlign: "left" }}>
          <img src={props.listing[8]} alt="listing" id="listing_image" />
        </div>
        <br />
        <div style={{ textAlign: "left" }}>
          <h2>{props.listing[3]}</h2>
          <h4>Seller: {props.listing[2]}</h4>
          <hr />
          <p>Category: {props.listing[4]}</p>
          <p>{props.listing[5]}</p>
          <p>
            <strong>Price:</strong> $ {props.price === "" ? props.listing[6] : props.price}
          </p>
          <p>
            <strong>Location:</strong> {props.listing[7]}
          </p>
          <br />
          {props.children}
        </div>
      </div>
    </>
  );
};

export default ListingsComponenet;
