import PropTypes from "prop-types";

const LogButton = ({ text }) => {
  return (
    <div>
      <button className="ui blue button">{text}</button>
    </div>
  );
};

// PropTypes validation
LogButton.propTypes = {
  text: PropTypes.string.isRequired, // Ensure 'text' prop is a required string
};

export default LogButton;
