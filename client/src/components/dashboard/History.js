import React, { Fragment } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClockLoader from 'react-spinners/ClockLoader';

const History = ({ history, loading }) => {
  const allMeetings = history.map((meeting) => (
    <tr key={meeting._id}>
      <td><span>&#9989;</span> {meeting.description}</td>
      <td>
        <Moment format='YYYY/MM/DD h:mm A'>{meeting.dateCreated}</Moment>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h4 className='text-left'>History</h4>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Description</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>{loading ? <ClockLoader /> : allMeetings}</tbody>
      </table>
    </Fragment>
  );
};

History.propTypes = {
  meetings: PropTypes.array.isRequired,
};

export default connect(null, null)(History);
