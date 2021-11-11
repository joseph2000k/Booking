import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { proceedScheduling } from '../../actions/authmeeting';
import { getRoom, getRoomMeetings } from '../../actions/rooms';
import PropTypes from 'prop-types';

const MeetingRoomItem = ({
  proceedScheduling,
  getRoomMeetings,
  getRoom,
  formData,
  toggleValue,
  value,
  room: { _id, name },
}) => {
  return (
    <div>
      <button
        className='btn btn-primary'
        onClick={(e) => {
          e.preventDefault();
          getRoom(_id);
          getRoomMeetings(_id);
          proceedScheduling(formData);
          {
            toggleValue(false);
          }
        }}
      >
        {name}
        {value}
      </button>
    </div>
  );
};

MeetingRoomItem.propTypes = {
  proceedScheduling: PropTypes.func.isRequired,
  getRoomMeetings: PropTypes.func.isRequired,
  getRoom: PropTypes.func.isRequired,
};

export default connect(null, { proceedScheduling, getRoomMeetings, getRoom })(
  MeetingRoomItem
);
