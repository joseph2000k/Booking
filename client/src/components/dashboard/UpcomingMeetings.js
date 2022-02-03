import React, { Fragment, useState } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";
import { cancelSchedule } from "../../actions/meeting";
import Modal from "react-bootstrap/Modal";

const UpcomingMeetings = ({ upcoming, loading, cancelSchedule }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [cancelMeetingId, setCancelMeetingId] = useState(null);
  const [cancelScheduleId, setCancelScheduleId] = useState(null);

  const handleCancel = () => {
    cancelSchedule(cancelMeetingId, cancelScheduleId);
    handleClose();
  };

  const handleCancelClick = (meetingId, scheduleId) => {
    handleShow();
    setCancelMeetingId(meetingId);
    setCancelScheduleId(scheduleId);
  };

  const allMeetings = upcoming.map((meeting) => (
    <tr key={meeting._id}>
      <td>{meeting.description}</td>
      <td>{meeting.room}</td>
      <td>
        <Moment format="h:mm a">{meeting.start}</Moment>
      </td>
      <td>
        <Moment format="h:mm a">{meeting.end}</Moment>
      </td>
      <td>
        <Moment format="MMMM Do YYYY, dddd">{meeting.start}</Moment>
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => handleCancelClick(meeting.meetingId, meeting._id)}
        >
          Cancel
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h4 className="text-left">Upcoming Meetings</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Room</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{loading ? <ClockLoader /> : allMeetings}</tbody>
      </table>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to Cancel this Schedule?</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-danger" onClick={handleCancel}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

UpcomingMeetings.propTypes = {
  upcoming: PropTypes.array.isRequired,
  cancelSchedule: PropTypes.func.isRequired,
};

export default connect(null, { cancelSchedule })(UpcomingMeetings);
