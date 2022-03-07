import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteSchedule } from "../../actions/meeting";

const Schedules = ({ toSubmit, deleteSchedule }) => {
  const allSchedules = toSubmit.map((schedule) => (
    <tr key={schedule.id}>
      <td>{schedule.roomName}</td>
      <td>
        <Moment format="h:mm A">{schedule.start}</Moment>
      </td>
      <td>
        <Moment format="h:mm A">{schedule.end}</Moment>
      </td>
      <td>
        <Moment format="YYYY/MM/DD">{schedule.end}</Moment>
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => deleteSchedule(schedule.id)}
        >
          Remove
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Room</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{allSchedules}</tbody>
      </table>
    </Fragment>
  );
};

Schedules.propTypes = {
  Schedules: PropTypes.array.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
};

export default connect(null, { deleteSchedule })(Schedules);
