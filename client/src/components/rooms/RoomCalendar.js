import React, { Fragment, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRoomMeetings } from "../../actions/rooms";

const RoomCalendar = ({ getRoomMeetings, match, meetings: { meetings } }) => {
  useEffect(() => {
    getRoomMeetings(match.params.id);
  }, [getRoomMeetings, match.params.id]);

  return (
    <div>
      <FullCalendar
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin]}
        events={[
          {
            id: "a",
            title: "Finance",
            start: `
            2021-11-01T10:30:00.000+00:00`,
            end: `
            2021-11-01T11:30:00.000+00:00`,
          },
        ]}
      />
    </div>
  );
};

RoomCalendar.propTypes = {
  getRoomMeetings: PropTypes.func.isRequired,
  meetings: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  meetings: state.room,
});

export default connect(mapStateToProps, { getRoomMeetings })(RoomCalendar);
