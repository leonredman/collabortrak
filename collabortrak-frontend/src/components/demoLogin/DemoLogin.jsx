import { Link } from "react-router-dom";
import LogButton from "../logButton/LogButton";

const DemoLogin = () => {
  return (
    <div
      className="demoLogContainer"
      style={{ marginLeft: "290px", marginTop: "40px" }}
    >
      <div className="ui grid">
        <div className="row">
          <div className="five wide column">
            <Link to="/Dashboard" className="item">
              <LogButton text="Site Admin" />
            </Link>
          </div>

          <div className="five wide column">
            <Link to="/Ws1Dashboard" className="item">
              <LogButton text="Ws Specialist" />
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="five wide column">
            <Link to="/DevDashboard" className="item">
              <LogButton text="Developer" />
            </Link>
          </div>

          <div className="five wide column">
            <Link to="/QaDashboard" className="item">
              <LogButton text="QA Agent" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;
