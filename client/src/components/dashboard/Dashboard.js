import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { removeTokenMeeting } from "../../actions/authmeeting";
import { loadOfficeMeetings } from "../../actions/authmeeting";

const Dashboard = ({ removeTokenMeeting, loadOfficeMeetings }) => {
  useEffect(() => {
    removeTokenMeeting();
    loadOfficeMeetings();
  }, [removeTokenMeeting, loadOfficeMeetings]);

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
  loadOfficeMeetings: PropTypes.func.isRequired,
};

export default connect(null, { removeTokenMeeting, loadOfficeMeetings })(
  Dashboard
);
