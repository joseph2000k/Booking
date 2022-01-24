import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { meetingHistory } from '../../actions/meeting';
import { getMeetings } from '../../actions/meeting';
import ClockLoader from 'react-spinners/ClockLoader';
import ToApprovedMeeting from './ToApprovedMeeting';
import { clearSchedules } from '../../actions/meeting';

const Dashboard = ({
  auth: { office, isSendingRequest },
  meetingHistory,
  getMeetings,
  clearSchedules,
  meeting: { history, loading },
}) => {
  useEffect(() => {
    meetingHistory();
    getMeetings();
    clearSchedules();
  }, [meetingHistory, getMeetings, clearSchedules]);

  return office === null || isSendingRequest ? (
    <div className='d-flex justify-content-center'>
      <ClockLoader />
    </div>
  ) : (
    <Fragment>
      <div>
        <h3 className='text-center'>{office.officeName} Office Dashboard</h3>
        <Link to='create-meeting'>
          <button className='btn btn-primary shadow m-3 position-absolute bottom-0 end-0'>
            <h5>
              <i class='fa fa-pencil-square' aria-hidden='true'></i> Schedule a
              Meeting
            </h5>
          </button>
        </Link>
      </div>
      <ToApprovedMeeting history={history} loading={loading} />
    </Fragment>
  );
};

Dashboard.propTypes = {
  meetingHistory: PropTypes.func.isRequired,
  getMeetings: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
  clearSchedules: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  meeting: state.meeting,
});

export default connect(mapStateToProps, {
  meetingHistory,
  getMeetings,
  clearSchedules,
})(Dashboard);
