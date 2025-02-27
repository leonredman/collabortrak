import { Link } from "react-router-dom";

const LoginHeader = () => {
  return (
    <div className="ui blue inverted menu">
      <Link to="/" className="item">
        CollaborTrak
      </Link>

      <Link to="/login" className="item">
        Login
      </Link>
      <Link to="/AccountRegister" className="item">
        Register
      </Link>
    </div>
  );
};

export default LoginHeader;
