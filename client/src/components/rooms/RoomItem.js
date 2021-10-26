import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getRooms } from "../../actions/rooms";

const RoomItem = ({ room: { _id, name } }) => (
  <div>
    <Link to={`/meeting/${_id}`}>
      <h4 className="btn btn-primary">{name}</h4>
    </Link>
  </div>
);

export default RoomItem;
