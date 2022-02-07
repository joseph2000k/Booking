import React, { Fragment, useState } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";
import { cancelSchedule } from "../../actions/meeting";
import Modal from "react-bootstrap/Modal";
import MeetingRooms from "./MeetingRooms";
import RoomCalendar from "./RoomCalendar";
import useToggle from "../../utils/useToggle";
import moment from "moment";

const UpcomingMeetings = ({ upcoming, loading, cancelSchedule }) => {
  const [roomId, setRoomId] = useState(null);

  //toggle for modal
  const [value, toggleValue] = useToggle(true);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //state for the modal room
  const [smShow, setSmShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);

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

  //for RoomCalendar
  const [dateValue, dateOnChange] = useState("");
  const [start, startOnChange] = useState("08:00");
  const [end, endOnChange] = useState("17:00");
  const startDate = moment(dateValue + " " + start, "YYYY-MM-DD HH:mm");
  const endDate = moment(dateValue + " " + end, "YYYY-MM-DD HH:mm");
  const handleCloseCalendar = (e) => setLgShow(false);

  const hideModal = () => {
    setLgShow(false);
    {
      toggleValue(true);
    }
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
        <button className="btn btn-primary" onClick={() => setLgShow(true)}>
          Reschedule
        </button>

        <button
          className="btn btn-danger"
          onClick={() => handleCancelClick(meeting.meetingId, meeting._id)}
        >
          Cancel
        </button>
      </td>
    </tr>
  ));

  const roomCalendar = (
    <RoomCalendar
      dateValue={dateValue}
      startOnChange={startOnChange}
      endOnChange={endOnChange}
      dateOnChange={dateOnChange}
      startDate={startDate}
      endDate={endDate}
      roomId={roomId}
      start={start}
      end={end}
      handleCloseCalendar={handleCloseCalendar}
    />
  );

  const meetingRooms = (
    <MeetingRooms toggleValue={toggleValue} setRoomId={setRoomId} />
  );

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
            No
          </button>
          <button className="btn btn-danger" onClick={handleCancel}>
            Yes, Cancel
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Small Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
      <Modal
        size="lg"
        show={lgShow}
        onHide={hideModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Change Schedule &nbsp; &nbsp;
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{value ? meetingRooms : roomCalendar}</Modal.Body>
      </Modal>
    </Fragment>
  );
};

UpcomingMeetings.propTypes = {
  upcoming: PropTypes.array.isRequired,
  cancelSchedule: PropTypes.func.isRequired,
};

export default connect(null, { cancelSchedule })(UpcomingMeetings);
