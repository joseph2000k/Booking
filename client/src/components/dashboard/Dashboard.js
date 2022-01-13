import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeTokenMeeting } from '../../actions/authmeeting';
import { loadOfficeMeetings } from '../../actions/authmeeting';
import { clearMeetings } from '../../actions/meeting';

const Dashboard = ({
  removeTokenMeeting,
  loadOfficeMeetings,
  clearMeetings,
}) => {
  useEffect(() => {
    removeTokenMeeting();
    loadOfficeMeetings();
    clearMeetings();
  }, [removeTokenMeeting, loadOfficeMeetings, clearMeetings]);

  return (
    <div>
      <Link to='create-meeting'>
        <h4 className='btn btn-primary'>Schedule Meeting</h4>
      </Link>
    </div>
  );
};

Dashboard.propTypes = {
  removeTokenMeeting: PropTypes.func.isRequired,
  loadOfficeMeetings: PropTypes.func.isRequired,
  clearMeetings: PropTypes.func.isRequired,
};

export default connect(null, {
  removeTokenMeeting,
  loadOfficeMeetings,
  clearMeetings,
})(Dashboard);
