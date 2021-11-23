import React, { useEffect } from "react";
import { connect } from "react-redux";
import Rooms from "../rooms/Rooms";
import PropTypes from "prop-types";
import { removeTokenMeeting } from "../../actions/authmeeting";

const Landing = ({ removeTokenMeeting }) => {
  useEffect(() => removeTokenMeeting(), [removeTokenMeeting]);
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <p className="lead">
            <Rooms />
          </p>
          {/* <div className="buttons">
            <a href="register.html" className="btn btn-primary">
              Sign Up
            </a>
            <a href="login.html" className="btn btn-light">
              Login
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  removeTokenMeeting: PropTypes.func.isRequired,
};

export default connect(null, { removeTokenMeeting })(Landing);
