import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { removeTokenMeeting } from "../../actions/authmeeting";

const Dashboard = ({ removeTokenMeeting }) => {
  useEffect(() => {
    removeTokenMeeting();
  }, [removeTokenMeeting]);

  return (
    <div>
      <Link to="create-meeting">
        <h4 className="btn btn-primary">Schedule Meeting</h4>
      </Link>
    </div>
  );
};

Dashboard.propTypes = {
  removeTokenMeeting: PropTypes.func.isRequired,
};

export default connect(null, { removeTokenMeeting })(Dashboard);
