const Login = (props) => {
  return (
    <div
      className="login_container"
      style={{
        display: props.display,
      }}
    >
      <h2>Log In</h2>
      <input type="text" placeholder="email" />
      <br />
      <input type="password" placeholder="password" />
      <br />
      {props.children}
    </div>
  );
};

export default Login;
