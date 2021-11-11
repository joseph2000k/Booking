import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setMeeting } from '../../actions/meeting';
import { proceedScheduling } from '../../actions/authmeeting';
import { loadCurrentMeeting } from '../../actions/authmeeting';
import useToggle from '../../utils/useToggle';
import { getRooms } from '../../actions/rooms';
import MeetingRoomItem from './MeetingRoomItem';
import Modal from 'react-bootstrap/Modal';

const ScheduleForm = ({ getRooms, room: { rooms } }) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const [smShow, setSmShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);

  const [formData, setFormData] = useState({
    specialInstructions: '',
    first: '',
    second: '',
  });

  const [value, toggleValue] = useToggle(true);

  const handleClose = (e) => setLgShow(false);

  const { specialInstructions, first, second } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const roomList = (
    <div>
      {rooms.map((room) => (
        <MeetingRoomItem
          key={room._id}
          room={room}
          formData={formData}
          toggleValue={toggleValue}
          value={value}
        ></MeetingRoomItem>
      ))}
    </div>
  );

  const roomCalendar = (
    <button
      className='btn btn-primary'
      onClick={(e) => {
        e.preventDefault();
        {
          toggleValue(true);
        }
        handleClose();
      }}
    >
      this is the calendar
    </button>
  );

  return (
    <Fragment>
      <h1 className='h-title'>Schedule a Meeting</h1>
      <form className='form'>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Write your special instructions here if any'
            name='specialInstructions'
            value={specialInstructions}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='first requirement'
            name='first'
            value={first}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='second requirement'
            name='second'
            value={second}
            onChange={onChange}
          />
        </div>
        <div>{value.toString()}</div>
        <input
          type='submit'
          value='Add Room and Date'
          onClick={toggleValue}
          className='btn btn-primary my-1'
          data-toggle='modal'
          data-target='#exampleModalCenter'
        />
      </form>

      <button className='btn btn-primary' onClick={() => setLgShow(true)}>
        Large modal
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
        onHide={() => setLgShow(false)}
        aria-labelledby='example-modal-sizes-title-lg'
      >
        <Modal.Header closeButton>
          <Modal.Title id='example-modal-sizes-title-lg'>
            Select a Room
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{value ? roomList : roomCalendar}</Modal.Body>
      </Modal>
    </Fragment>
  );
};

ScheduleForm.propTypes = {
  proceedScheduling: PropTypes.func.isRequired,
  loadCurrentMeeting: PropTypes.func.isRequired,
  getRooms: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  room: state.room,
});

export default connect(mapStateToProps, {
  proceedScheduling,
  loadCurrentMeeting,
  getRooms,
})(ScheduleForm);
