const Logo = (props) => {
  return (
    <div className="Logo">
      <span
        style={{
          fontSize: props.size,
        }}
      >
        <span
          style={{
            color: "#005bbb",
          }}
        >
          UB
        </span>
        <span
          style={{
            color: "#f4ae01",
          }}
        >
          a
        </span>
        <span
          style={{
            color: "#88b719",
          }}
        >
          y
        </span>
      </span>
    </div>
  );
};

export default Logo;
