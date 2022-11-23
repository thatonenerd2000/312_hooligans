const Signup = (props) => {
  return (
    <div
      className="signup_container"
      style={{
        display: props.display,
      }}
    >
      <h2>Sign up</h2>
      <input type="text" placeholder="First Name" />
      <br />
      <input type="text" placeholder="Last Name" />
      <br />
      <input type="text" placeholder="email" />
      <br />
      <input type="password" placeholder="password" />
      <br />
      <input type="password" placeholder="confirm password" />
      <br />
      {props.children}
    </div>
  );
};

export default Signup;
