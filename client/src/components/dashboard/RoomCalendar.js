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
import Moment from "react-moment";
import { checkSchedule } from "../../actions/meeting";
import { rescheduleMeeting } from "../../actions/meeting";

const MeetingRoomCalendar = ({
  getRoom,
  getRoomMeetings,
  roomId,
  start,
  schedule,
  startOnChange,
  end,
  endOnChange,
  dateOnChange,
  dateValue,
  rescheduleMeeting,
  toggleValue,
  handleCloseCalendar,
  meetings: { meetings, room },
}) => {
  useEffect(() => {
    getRoom(roomId);
    getRoomMeetings(roomId);
  }, [getRoom, getRoomMeetings]);

  const selectAllow = (e) => {
    if (e.end.getTime() / 1000 - e.start.getTime() / 1000 <= 86400) {
      return true;
    }
  };

  const handleConfirmClick = () => {
    rescheduleMeeting(schedule);
    toggleValue(true);
    handleCloseCalendar();
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        From:
        <TimePicker
          className="border border-primary border-3 rounded"
          disableClock="true"
          minTime="06:00:00"
          clearIcon
          onChange={startOnChange}
          value={start}
        />
        To:
        <TimePicker
          className="border border-primary border-3 rounded"
          disableClock="true"
          minTime="06:00:00"
          clearIcon
          onChange={endOnChange}
          value={end}
        />
        Date:{" "}
        {dateValue === "" ? (
          " Please select a date below"
        ) : (
          <Moment format="MM-DD-YYYY">{dateValue}</Moment>
        )}
        <button className="btn btn-primary" onClick={handleConfirmClick}>
          Confirm
        </button>
      </div>
      <h2 className="h-title">{room.name}</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
        weekends={false}
        defaultView="dayGridMonth"
        themeSystem="standard"
        height="auto"
        displayEventTime={false}
        events={meetings}
        selectable={true}
        selectAllow={selectAllow}
        displayEventTime={true}
        displayEventEnd={true}
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
  checkSchedule: PropTypes.func.isRequired,
  rescheduleMeeting: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  meetings: state.room,
});

export default connect(mapStateToProps, {
  getRoomMeetings,
  getRoom,
  checkSchedule,
  rescheduleMeeting,
})(MeetingRoomCalendar);
