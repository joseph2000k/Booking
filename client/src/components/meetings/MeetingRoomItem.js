import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getRoom, getRoomMeetings } from "../../actions/rooms";
import PropTypes from "prop-types";

const MeetingRoomItem = ({
  getRoomMeetings,
  getRoom,

  toggleValue,
  value,
  room: { _id, name },
  setRoomId,
}) => {
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={(e) => {
          e.preventDefault();
          getRoom(_id);
          getRoomMeetings(_id);
          setRoomId(_id);
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
  getRoomMeetings: PropTypes.func.isRequired,
  getRoom: PropTypes.func.isRequired,
};

export default connect(null, { getRoomMeetings, getRoom })(MeetingRoomItem);
