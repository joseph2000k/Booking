import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { proceedScheduling } from '../../actions/authmeeting';
import PropTypes from 'prop-types';

const MeetingRoomItem = ({
  proceedScheduling,
  formData,
  room: { _id, name },
}) => (
  <div>
    <button
      className='btn btn-primary'
      onClick={(e) => {
        e.preventDefault();
        proceedScheduling(formData);
      }}
    >
      {name}
    </button>
  </div>
);

MeetingRoomItem.propTypes = {
  proceedScheduling: PropTypes.func.isRequired,
};

export default connect(null, { proceedScheduling })(MeetingRoomItem);
