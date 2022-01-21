import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { removeTokenMeeting } from "../../actions/authmeeting";
import { loadOfficeMeetings } from "../../actions/authmeeting";
import { clearMeetings } from "../../actions/meeting";
import { getMeetings } from "../../actions/meeting";
import ClockLoader from "react-spinners/ClockLoader";
import ToApprovedMeeting from "./ToApprovedMeeting";

const Dashboard = ({
  auth: { office },
  removeTokenMeeting,
  loadOfficeMeetings,
  clearMeetings,
  getMeetings,
  meeting: { meetings },
}) => {
  useEffect(() => {
    removeTokenMeeting();
    loadOfficeMeetings();
    clearMeetings();
    getMeetings();
  }, [removeTokenMeeting, loadOfficeMeetings, clearMeetings, getMeetings]);

  return office === null ? (
    <div className="d-flex justify-content-center">
      <ClockLoader />
    </div>
  ) : (
    <Fragment>
      <div>
        <h3 className="">{office.officeName} Office Dashboard</h3>
        <Link to="create-meeting">
          <button className="btn btn-primary shadow m-3 position-absolute bottom-0 end-0">
            <h5>
              <i class="fa fa-pencil-square" aria-hidden="true"></i> Schedule a
              Meeting
            </h5>
          </button>
        </Link>
      </div>
      <ToApprovedMeeting meetings={meetings} />
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
