import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMeetings } from '../../actions/meeting';
import ClockLoader from 'react-spinners/ClockLoader';
import History from './History';
import ForApproval from './ForApproval';
import { clearSchedules } from '../../actions/meeting';
import { getSchedules } from '../../actions/meeting';
import { deleteMeeting } from '../../actions/meeting';
import UpcomingMeetings from './UpcomingMeetings';
import moment from 'moment';

const Dashboard = ({
  auth: { office, isSendingRequest },
  getMeetings,
  getSchedules,
  clearSchedules,
  meeting: { loading, schedules },
  meetings,
  deleteMeeting,
}) => {
  useEffect(() => {
    getSchedules();
    getMeetings();
    clearSchedules();
  }, [getMeetings, getSchedules, clearSchedules]);

  const forApproval = meetings.filter(
    (meeting) => meeting.isApproved === false
  );

  const historyMeetings = [];
  const upcomingMeetings = [];
  for (let i = 0; i < schedules.length; i++) {
    if (moment(schedules[i].start).isAfter(moment())) {
      upcomingMeetings.push(schedules[i]);
    } else {
      historyMeetings.push(schedules[i]);
    }
  }

  console.log(historyMeetings);

  return office === null || isSendingRequest ? (
    <div className='d-flex justify-content-center'>
      <ClockLoader />
    </div>
  ) : (
    <Fragment>
      <div>
        <h3 className='text-center'>{office.officeName} Office Dashboard</h3>
        <Link to='create-meeting'>
          <button className='btn btn-primary shadow m-3 position-fixed bottom-0 end-0'>
            <h5>
              <i class='fa fa-pencil-square' aria-hidden='true'></i> Schedule a
              Meeting
            </h5>
          </button>
        </Link>
      </div>
      {meetings.length > 0 && (
        <ForApproval meetings={forApproval} deleteMeeting={deleteMeeting} />
      )}
      {upcomingMeetings.length > 0 && (
        <UpcomingMeetings upcoming={upcomingMeetings} />
      )}

      <History history={historyMeetings} loading={loading} />
    </Fragment>
  );
};

Dashboard.propTypes = {
  getMeetings: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
  clearSchedules: PropTypes.func.isRequired,
  meetings: PropTypes.array.isRequired,
  getSchedules: PropTypes.func.isRequired,
  deleteMeeting: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  meeting: state.meeting,
  meetings: state.meeting.meetings,
});

export default connect(mapStateToProps, {
  getMeetings,
  clearSchedules,
  getSchedules,
  deleteMeeting,
})(Dashboard);
