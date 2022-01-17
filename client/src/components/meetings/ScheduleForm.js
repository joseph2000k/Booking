import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setMeeting } from '../../actions/meeting';
import { proceedScheduling } from '../../actions/authmeeting';
import { loadCurrentMeeting } from '../../actions/authmeeting';
import useToggle from '../../utils/useToggle';
import { getRooms } from '../../actions/rooms';
import { submitMeeting } from '../../actions/meeting';
import MeetingRoomItem from './MeetingRoomItem';
import Schedules from './Schedules';
import Modal from 'react-bootstrap/Modal';
import MeetingRoomCalendar from './MeetingRoomCalendar';
import moment from 'moment';

const ScheduleForm = ({
  getRooms,
  room: { rooms },
  submitMeeting,
  meetings: { schedules },
}) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);

  let history = useHistory();

  //state for the modal
  const [smShow, setSmShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  //state for the calendar
  const [roomId, setRoomId] = useState('');

  //state for the meeting
  const [formData, setFormData] = useState({
    specialInstructions: '',
    first: '',
    second: '',
  });
  //toggle for modal
  const [value, toggleValue] = useToggle(true);

  const [dateValue, dateOnChange] = useState('');
  const [start, startOnChange] = useState('08:00');
  const [end, endOnChange] = useState('17:00');
  const startDate = moment(dateValue + ' ' + start, 'YYYY-MM-DD HH:mm');
  const endDate = moment(dateValue + ' ' + end, 'YYYY-MM-DD HH:mm');

  const handleClose = (e) => setLgShow(false);

  const {
    contactName,
    contactNumber,
    numberOfAttendees,
    description,
    specialInstructions,
    first,
    second,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const meeting = {
    ...formData,
    schedules: schedules,
  };

  const schedule = {
    start: startDate,
    end: endDate,
    room: roomId,
  };

  const hideModal = () => {
    setLgShow(false);
    {
      toggleValue(true);
    }
  };

  const roomList = (
    <div className='d-flex justify-content-center'>
      {rooms.map((room) => (
        <MeetingRoomItem
          key={room._id}
          room={room}
          formData={formData}
          toggleValue={toggleValue}
          value={value}
          setRoomId={setRoomId}
        ></MeetingRoomItem>
      ))}
    </div>
  );

  const roomCalendar = (
    <div>
      <MeetingRoomCalendar
        roomId={roomId}
        start={start}
        startOnChange={startOnChange}
        end={end}
        endOnChange={endOnChange}
        dateOnChange={dateOnChange}
        dateValue={dateValue}
        meeting={meeting}
        schedule={schedule}
        toggleValue={toggleValue}
        handleClose={handleClose}
      ></MeetingRoomCalendar>
    </div>
  );

  return (
    <Fragment>
      <div className='container mt-0 bg-light p-5'>
        <div className='p-2 bg-white rounded shadow-sm'>
          <h2 className='h-title'>Schedule a Meeting</h2>
          <form className='form'>
            <div className='form-group'>
              <div class='input-group'>
                <label for='description' className='col-sm-2 col-form-label'>
                  Meeting Description:
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Meeting Description'
                  name='description'
                  value={description}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className='form-group'>
              <div class='input-group'>
                <label for='contactName' class='col-sm-2 col-form-label'>
                  Contact Name:
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Name of Contact'
                  name='contactName'
                  value={contactName}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className='form-group'>
              <div class='input-group'>
                <label for='contactNumber' class='col-sm-2 col-form-label'>
                  {' '}
                  Contact Number:{' '}
                </label>
                <input
                  className='form-control'
                  type='text'
                  placeholder='Contact Number'
                  name='contactNumber'
                  value={contactNumber}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className='form-group'>
              <div class='input-group'>
                <label for='numberOfAttendees' class='col-sm-2 col-form-label'>
                  {' '}
                  Number of Attendees:{' '}
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Estimated Number of Attendees'
                  name='numberOfAttendees'
                  value={numberOfAttendees}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className='form-group'>
              <div class='input-group'>
                <label
                  for='specialInstructions'
                  class='col-sm-2 col-form-label'
                >
                  Instructions:
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Write your special instructions here if any'
                  name='specialInstructions'
                  value={specialInstructions}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className='form-group'>
              <div class='input-group'>
                <label for='first' class='col-sm-2 col-form-label'>
                  {' '}
                  Requirements:{' '}
                </label>
                <input
                  type='text'
                  className='form-control'
                  name='first'
                  value={first}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className='form-group'>
              <div class='input-group'>
                <label for='second' class='col-sm-2 col-form-label' />
                <input
                  type='text'
                  className='form-control'
                  name='second'
                  value={second}
                  onChange={onChange}
                />
              </div>
            </div>
          </form>
          <button className='btn btn-primary' onClick={() => setLgShow(true)}>
            Add Room and Date
          </button>
          <Modal
            size='sm'
            show={smShow}
            onHide={() => setSmShow(false)}
            aria-labelledby='example-modal-sizes-title-sm'
          >
            <Modal.Header closeButton>
              <Modal.Title id='example-modal-sizes-title-sm'>
                Small Modal
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>...</Modal.Body>
          </Modal>
          <Modal
            size='lg'
            show={lgShow}
            onHide={hideModal}
            aria-labelledby='example-modal-sizes-title-lg'
          >
            <Modal.Header closeButton>
              <Modal.Title id='example-modal-sizes-title-lg'>
                Add a Schedule
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{value ? roomList : roomCalendar}</Modal.Body>
          </Modal>
        </div>
        <div className='mt-2'>
          {schedules != 0 && (
            <Fragment>
              <Schedules schedules={schedules} />
              <button
                className='btn btn-primary'
                onClick={() => submitMeeting(meeting, history)}
              >
                Submit
              </button>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

ScheduleForm.propTypes = {
  proceedScheduling: PropTypes.func.isRequired,
  loadCurrentMeeting: PropTypes.func.isRequired,
  getRooms: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
  submitMeeting: PropTypes.func.isRequired,
  meetings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  room: state.room,
  meeting: state.meetingauth,
  meetings: state.meeting,
});

export default connect(mapStateToProps, {
  proceedScheduling,
  loadCurrentMeeting,
  getRooms,
  submitMeeting,
})(ScheduleForm);
