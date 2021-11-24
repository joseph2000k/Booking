import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { Fragment, useEffect } from "react";
import RoomItem from "./RoomItem";
import { getRooms } from "../../actions/rooms";

const Rooms = ({ getRooms, room: { rooms } }) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);
  return (
    <Fragment>
      <h4 className="mb-4">Quick View Calendar</h4>
      <div className="d-flex justify-content-around">
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
