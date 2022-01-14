import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getRoom, getRoomMeetings } from '../../actions/rooms';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
const MeetingRoomItem = ({
  getRoomMeetings,
  getRoom,

  toggleValue,
  value,
  room: { _id, name },
  setRoomId,
}) => {
  const onClick = (e) => {
    e.preventDefault();
    getRoom(_id);
    getRoomMeetings(_id);
    setRoomId(_id);
    {
      toggleValue(false);
    }
  };
  return (
    <div className='mx-4'>
      <Card
        className='mx-4 shadow p-0 mb-5 bg-white rounded'
        style={{ width: '10rem', textDecoration: 'none', color: 'black' }}
      >
        <Card.Img variant='top' src={`img/${_id}.jpg`} />
        <Card.Body>
          <Card.Title className='d-flex justify-content-center'>
            {name}
          </Card.Title>
          <Card.Text></Card.Text>
          <div className='d-flex justify-content-center'>
            <button className='btn btn-primary' onClick={onClick}>
              Select
            </button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

MeetingRoomItem.propTypes = {
  getRoomMeetings: PropTypes.func.isRequired,
  getRoom: PropTypes.func.isRequired,
};

export default connect(null, { getRoomMeetings, getRoom })(MeetingRoomItem);
