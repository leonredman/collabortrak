import LoginForm from "../components/loginForm/LoginForm";
import LoginHeader from "../components/loginHeader/LoginHeader";
import "../components/mainLogin/MainLoginStyles.css";

const Login = () => {
  return (
    <div>
      <LoginHeader />
      <div className="ui-container-login" id="loginBackgroundImg">
        <div className="ui grid">
          <div className="ui-container-login">
            <div className="row">
              <div className="four wide centered column">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
