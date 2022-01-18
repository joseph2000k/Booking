import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { removeTokenMeeting } from "../../actions/authmeeting";
import { loadOfficeMeetings } from "../../actions/authmeeting";
import { clearMeetings } from "../../actions/meeting";
import { getMeetings } from "../../actions/meeting";

const Dashboard = ({
  auth: { office },
  removeTokenMeeting,
  loadOfficeMeetings,
  clearMeetings,
  getMeetings,
}) => {
  useEffect(() => {
    removeTokenMeeting();
    loadOfficeMeetings();
    clearMeetings();
    getMeetings();
  }, [removeTokenMeeting, loadOfficeMeetings, clearMeetings, getMeetings]);

  return (
    <Fragment>
      <div>
        <h1 className="">{office.officeName} Office Dashboard</h1>
        <Link to="create-meeting">
          <button className="btn btn-primary m-3 position-absolute bottom-0 end-0">
            Schedule Meeting
          </button>
        </Link>
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  removeTokenMeeting: PropTypes.func.isRequired,
  loadOfficeMeetings: PropTypes.func.isRequired,
  clearMeetings: PropTypes.func.isRequired,
  getMeetings: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  meeting: state.meeting,
});

export default connect(mapStateToProps, {
  removeTokenMeeting,
  loadOfficeMeetings,
  clearMeetings,
  getMeetings,
})(Dashboard);
