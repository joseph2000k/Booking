import React, { Fragment } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClockLoader from 'react-spinners/ClockLoader';
import { cancelSchedule } from '../../actions/meeting';

const UpcomingMeetings = ({ upcoming, loading, cancelSchedule }) => {
  const allMeetings = upcoming.map((meeting) => (
    <tr key={meeting._id}>
      <td>{meeting.description}</td>
      <td>{meeting.room}</td>
      <td>
        <Moment format='h:mm a'>{meeting.start}</Moment>
      </td>
      <td>
        <Moment format='h:mm a'>{meeting.end}</Moment>
      </td>
      <td>
        <Moment format='MMMM Do YYYY, dddd'>{meeting.start}</Moment>
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => cancelSchedule(meeting.meetingId, meeting._id)}
        >
          Cancel
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h4 className='text-left'>Upcoming Meetings</h4>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Description</th>
            <th>Room</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{loading ? <ClockLoader /> : allMeetings}</tbody>
      </table>
    </Fragment>
  );
};

UpcomingMeetings.propTypes = {
  upcoming: PropTypes.array.isRequired,
  cancelSchedule: PropTypes.func.isRequired,
};

export default connect(null, { cancelSchedule })(UpcomingMeetings);
