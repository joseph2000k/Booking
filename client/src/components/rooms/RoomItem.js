import React from "react";
import { Link } from "react-router-dom";

const RoomItem = ({ room: { _id, name } }) => (
  <div>
    <Link to={`/meeting/${_id}`}>
      <h4 className="btn btn-primary">{name}</h4>
    </Link>
  </div>
);

export default RoomItem;
