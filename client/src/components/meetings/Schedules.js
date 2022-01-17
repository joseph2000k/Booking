import React, { Fragment } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteSchedule } from '../../actions/meeting';

const Schedules = ({ meetings, deleteSchedule }) => {
  const allSchedules = meetings.map((meeting) => (
    <tr key={meeting.id}>
      <td>{meeting.roomName}</td>
      <td>
        <Moment format='h:mm A'>{meeting.start}</Moment>
      </td>
      <td>
        <Moment format='h:mm A'>{meeting.end}</Moment>
      </td>
      <td>
        <Moment format='YYYY/MM/DD'>{meeting.end}</Moment>
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => deleteSchedule(meeting.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Room</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{allSchedules}</tbody>
      </table>
    </Fragment>
  );
};

Schedules.propTypes = {
  meetings: PropTypes.array.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
};

export default connect(null, { deleteSchedule })(Schedules);
