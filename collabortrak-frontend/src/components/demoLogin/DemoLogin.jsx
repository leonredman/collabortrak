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
            <Link to="/AdminDashboard" className="item">
              <LogButton text="Site Admin" />
            </Link>
          </div>

          <div className="five wide column">
            <Link to="/WebsiteSpecialistDashboard" className="item">
              <LogButton text="WS Specialist" />
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="five wide column">
            <Link to="/DeveloperDashboard" className="item">
              <LogButton text="Developer" />
            </Link>
          </div>

          <div className="five wide column">
            <Link to="/QADashboard" className="item">
              <LogButton text="QA Agent" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;
