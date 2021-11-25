import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRoomMeetings } from "../../actions/rooms";
import { getRoom } from "../../actions/rooms";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

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

  const handleMouseEnter = (arg) => {
    tippy(arg.el, {
      content: arg.event.extendedProps.description,
    });
  };

  return (
    <div className="calendar">
      <h2 className="h-title">{room.name}</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
        weekends={false}
        defaultView="dayGridMonth"
        themeSystem="standard"
        height="auto"
        displayEventTime={true}
        displayEventEnd={true}
        events={meetings}
        eventMouseEnter={handleMouseEnter}
        selectable={true}
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
