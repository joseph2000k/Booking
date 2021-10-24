import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import RoomItem from './RoomItem';
import { getRooms } from '../../actions/rooms';
import calendar from './RoomCalendar';

const Rooms = ({ getRooms, room: { rooms } }) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);
  return (
    <Fragment>
      <h1 className='h-title'>Rooms</h1>
      <div>
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
