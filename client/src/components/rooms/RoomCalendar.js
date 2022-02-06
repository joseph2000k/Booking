import React, { useEffect, Fragment } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getRoomMeetings } from '../../actions/rooms';
import { getRoom } from '../../actions/rooms';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const RoomCalendar = ({
  isAuthenticated,
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

  const history = useHistory();

  const handleCreateMeeting = () => {
    history.push('/create-meeting');
  };

  return (
    <Fragment>
      <div className='calendar bg-light p-4 rounded shadow'>
        <h2 className='h-title'>{room.name}</h2>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
          weekends={false}
          defaultView='dayGridMonth'
          themeSystem='standard'
          height='auto'
          displayEventTime={true}
          displayEventEnd={true}
          events={meetings}
          eventMouseEnter={handleMouseEnter}
          selectable={true}
        />
      </div>

      {isAuthenticated && (
        <button
          className='btn btn-primary shadow m-3 position-fixed bottom-0 end-0'
          onClick={handleCreateMeeting}
        >
          <h5>
            <i class='fa fa-pencil-square' aria-hidden='true'></i> Schedule a
            Meeting
          </h5>
        </button>
      )}
    </Fragment>
  );
};

RoomCalendar.propTypes = {
  getRoomMeetings: PropTypes.func.isRequired,
  getRoom: PropTypes.func.isRequired,
  meetings: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  meetings: state.room,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getRoomMeetings, getRoom })(
  RoomCalendar
);
