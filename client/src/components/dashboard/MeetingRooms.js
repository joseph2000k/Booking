import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getRoom, getRoomMeetings } from "../../actions/rooms";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { getRooms } from "../../actions/rooms";

const MeetingRoomItem = ({ getRooms, toggleValue, rooms }) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const [roomId, setRoomId] = useState(null);

  return (
    <div className="mx-4 d-flex justify-content-center">
      {rooms.map((room) => (
        <Card
          className="mx-4 shadow p-0 mb-5 bg-white rounded"
          style={{ width: "10rem", textDecoration: "none", color: "black" }}
        >
          <Card.Img variant="top" src={`img/${room._id}.jpg`} />
          <Card.Body>
            <Card.Title className="d-flex justify-content-center">
              {room.name}
            </Card.Title>
            <Card.Text></Card.Text>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setRoomId(room._id);
                  {
                    toggleValue(false);
                  }
                }}
              >
                Select
              </button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

MeetingRoomItem.propTypes = {
  getRoomMeetings: PropTypes.func.isRequired,
  getRoom: PropTypes.func.isRequired,
  getRooms: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  rooms: state.room.rooms,
});

export default connect(mapStateToProps, { getRoomMeetings, getRoom, getRooms })(
  MeetingRoomItem
);
