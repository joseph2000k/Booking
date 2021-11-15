import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRoomMeetings } from "../../actions/rooms";
import { getRoom } from "../../actions/rooms";
import TimePicker from "react-time-picker";

const MeetingRoomCalendar = ({
  getRoom,
  getRoomMeetings,
  roomId,
  fromValue,
  fromOnChange,
  toValue,
  toOnChange,
  dateOnChange,
  dateValue,
  meetings: { meetings, room },
}) => {
  useEffect(() => {
    getRoom(roomId);
    getRoomMeetings(roomId);
  }, [getRoom, getRoomMeetings]);

  return (
    <div>
      <div className="d-flex justify-content-center">
        From:
        <TimePicker
          className="border border-primary border-3 rounded"
          disableClock="true"
          minTime="06:00:00"
          clearIcon
          onChange={fromOnChange}
          value={fromValue}
        />
        To:
        <TimePicker
          className="border border-primary border-3 rounded"
          disableClock="true"
          minTime="06:00:00"
          clearIcon
          onChange={toOnChange}
          value={toValue}
        />
        Date: {dateValue === "" ? " Please select a date below" : dateValue}
      </div>
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
          dateOnChange(info.dateStr);
        }}
      />
    </div>
  );
};

MeetingRoomCalendar.propTypes = {
  getRoomMeetings: PropTypes.func.isRequired,
  getRoom: PropTypes.func.isRequired,
  meetings: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  meetings: state.room,
});

export default connect(mapStateToProps, { getRoomMeetings, getRoom })(
  MeetingRoomCalendar
);
