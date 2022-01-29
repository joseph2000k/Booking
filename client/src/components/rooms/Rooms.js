import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { getRooms } from '../../actions/rooms';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const Rooms = ({ getRooms, room: { rooms } }) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const RoomItem = ({ room: { _id, name } }) => (
    <Link
      className='mx-4 shadow p-0 mb-5 bg-white rounded'
      to={`/meeting/${_id}`}
      style={{ textDecoration: 'none', color: 'black' }}
      variant='primary'
    >
      <Card style={{ width: '15rem' }}>
        <Card.Img variant='top' src={`img/${_id}.jpg`} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text className='font-size: small'>Room Description</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );

  return (
    <Fragment>
      <h4 className='mb-4'>Quick View Calendar</h4>
      <div className='d-flex justify-content-around'>
        {rooms.map((room) => (
          <RoomItem key={room._id} room={room}></RoomItem>
        ))}
      </div>
    </Fragment>
  );
};

Rooms.propTypes = {
  getRooms: PropTypes.func.isRequired,
  rooms: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  room: state.room,
});

export default connect(mapStateToProps, { getRooms })(Rooms);
