import React from "react";
import { Link } from "react-router-dom";

const MeetingRoomItem = ({ room: { _id, name } }) => (
  <div>
    <h4 className="btn btn-primary">{name}</h4>
  </div>
);

export default MeetingRoomItem;
