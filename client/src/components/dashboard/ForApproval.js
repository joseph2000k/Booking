import React, { Fragment, useState } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";
import Modal from "react-bootstrap/Modal";

const ForApproval = ({ meetings, loading, deleteMeeting }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = () => {
    deleteMeeting(deleteId);
    handleClose();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    handleShow();
  };

  const allMeetings = meetings.map((meeting) => (
    <tr key={meeting._id}>
      <td>{meeting.description}</td>
      <td>{meeting.contactName}</td>
      <td>
        <Moment format="YYYY/MM/DD h:mm A">{meeting.dateCreated}</Moment>
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => handleDeleteClick(meeting._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h4 className="text-left">For Approval</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Submitted By</th>
            <th>Date Submitted</th>
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
          <Modal.Title>Delete Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this meeting?</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

ForApproval.propTypes = {
  meetings: PropTypes.array.isRequired,
};

export default connect(null, null)(ForApproval);
