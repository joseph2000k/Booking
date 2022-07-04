import React, { useEffect, Fragment, useRef } from 'react';
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
import ReactToPrint from 'react-to-print';

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

  const componentRef = useRef();
  const printRef = useRef();

  const dateRef = useRef();

  return (
    <Fragment>
      <div className='container-component'>
        <div ref={componentRef}>
          <div className='calendar bg-light p-4 rounded shadow'>
            <div className='d-flex justify-content-between'>
              <div>
                <h2 className='h-title'>{room.name}</h2>
              </div>
              <div>
                <ReactToPrint
                  trigger={() => (
                    <button ref={printRef} className='btn btn-primary'>
                      Print
                    </button>
                  )}
                  documentTitle='Meeting Schedule'
                  content={() => componentRef.current}
                  onBeforeGetContent={() => {
                    printRef.current.hidden = true;
                    dateRef.current.hidden = false;
                    //hide toolbar
                    document.getElementsByClassName(
                      'fc-today-button'
                    )[0].hidden = true;
                    document.getElementsByClassName(
                      'fc-button-group'
                    )[0].hidden = true;
                    document.getElementsByClassName(
                      'fc-dayGridMonth-button'
                    )[0].hidden = true;
                    document.getElementsByClassName(
                      'fc-dayGridWeek-button'
                    )[0].hidden = true;
                    document.getElementsByClassName(
                      'fc-dayGridDay-button'
                    )[0].hidden = true;
                  }}
                  onAfterPrint={() => {
                    printRef.current.hidden = false;
                    dateRef.current.hidden = true;
                    //show toolbar again
                    document.getElementsByClassName(
                      'fc-today-button'
                    )[0].hidden = false;
                    document.getElementsByClassName(
                      'fc-button-group'
                    )[0].hidden = false;
                    document.getElementsByClassName(
                      'fc-dayGridMonth-button'
                    )[0].hidden = false;
                    document.getElementsByClassName(
                      'fc-dayGridWeek-button'
                    )[0].hidden = false;
                    document.getElementsByClassName(
                      'fc-dayGridDay-button'
                    )[0].hidden = false;
                  }}
                />
              </div>
            </div>

            <FullCalendar
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay',
              }}
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
          {
            <div ref={dateRef} hidden={true}>
              <span className='d-flex justify-content-center'>{`As of ${new Date()}`}</span>
            </div>
          }
        </div>
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
