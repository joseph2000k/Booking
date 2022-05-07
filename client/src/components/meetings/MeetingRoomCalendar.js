import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRoomMeetings } from '../../actions/rooms';
import { getRoom } from '../../actions/rooms';
import TimePicker from 'react-time-picker';
import Moment from 'react-moment';
import { checkSchedule } from '../../actions/meeting';

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
  checkSchedule,
  toggleValue,
  handleClose,
  setOfficeId,
  toSubmit,
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

  const handleConfirm = () => {
    checkSchedule(schedule);
    {
      toggleValue(true);
    }
    if (toSubmit.length === 0) {
      setOfficeId('');
    }
    handleClose();
  };

  return (
    <div>
      <div className='d-flex justify-content-center'>
        From:
        <TimePicker
          className='border border-primary border-3 rounded'
          disableClock='true'
          minTime='06:00:00'
          clearIcon
          onChange={startOnChange}
          value={start}
        />
        To:
        <TimePicker
          className='border border-primary border-3 rounded'
          disableClock='true'
          minTime='06:00:00'
          clearIcon
          onChange={endOnChange}
          value={end}
        />
        Date:{' '}
        {dateValue === '' ? (
          ' Please select a date below'
        ) : (
          <Moment format='MM-DD-YYYY'>{dateValue}</Moment>
        )}
        <button
          {...(dateValue ? { disabled: false } : { disabled: true })}
          className='btn btn-primary'
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
      <h1 className='h-title'>{room.name}</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
        weekends={false}
        defaultView='dayGridMonth'
        themeSystem='standard'
        height='auto'
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
  toSubmit: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  meetings: state.room,
  toSubmit: state.meeting.toSubmit,
});

export default connect(mapStateToProps, {
  getRoomMeetings,
  getRoom,
  checkSchedule,
})(MeetingRoomCalendar);
