import { Link } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = () => {
  return (
    <div
      className="loginContainer"
      style={{ marginLeft: "260px", marginTop: "150px", marginBottom: "50px" }}
    >
      <div className="ui grid">
        <h1>LOGIN</h1>
        <p>Welcome back. Please login to your account</p>
        <form className="ui form">
          <div className="field">
            <label>
              EMAIL ADDRESS:
              <input type="email" name="email" />
            </label>
          </div>
          <br />
          <div className="field">
            <label>
              PASSWORD:
              <input type="text" name="password" />
            </label>
          </div>
          <br />
          <input type="checkbox" name="remember" /> Remember me
          <br />
          <br />
          <input type="submit" value="Submit" />
        </form>
        <br />

        <div>
          <br />
          <Link to="/AccountRegister" className="item">
            Register as a new User
          </Link>
        </div>
        <br />
        <div>
          <br />
          <Link to="/ResetPassword" className="item">
            Forgot your Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
