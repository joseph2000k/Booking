import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRoomMeetings } from "../../actions/rooms";
import { getRoom } from "../../actions/rooms";

const RoomCalendar = ({
  getRoom,
  getRoomMeetings,
  match,
  meetings: { meetings, room },
}) => {
  useEffect(() => {
    getRoom(match.params.id);
    getRoomMeetings(match.params.id);
  }, [getRoom, getRoomMeetings, match.params.id]);

  return (
    <div>
      <h1 className="h-title">{room.name}</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
        weekends={false}
        defaultView="dayGridMonth"
        themeSystem="standard"
        height="auto"
        displayEventTime={false}
        events={meetings}
        dateClick={(info) => {
          alert("Clicked on: " + info.dateStr);
        }}
      />
    </div>
  );
};

RoomCalendar.propTypes = {
  getRoomMeetings: PropTypes.func.isRequired,
  getRoom: PropTypes.func.isRequired,
  meetings: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  meetings: state.room,
});

export default connect(mapStateToProps, { getRoomMeetings, getRoom })(
  RoomCalendar
);
