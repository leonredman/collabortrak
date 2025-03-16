import LoginForm from "../loginForm/LoginForm";
import "./MainLoginStyles.css";

const MainLogin = () => {
  return (
    <div className="ui-container-login">
      <div
        className="ui-container-login"
        style={{
          background:
            "linear-gradient(90deg, rgba(68,189,234,1) 0%, rgba(52,99,203,1) 100%)",
        }}
      >
        <div className="ui middle aligned center aligned grid">
          <div className="four wide column" style={{ background: "white" }}>
            <LoginForm />
          </div>
          <div className="four wide column" id="loginImage"></div>
        </div>
      </div>
    </div>
  );
};

export default MainLogin;
