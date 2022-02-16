import React, { Fragment, useState, useEffect } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";
import { getForApprovalMeetings } from "../../../actions/meeting";
import { approveMeeting } from "../../../actions/meeting";
import Modal from "react-bootstrap/Modal";

const ForApprovalofAdmin = ({
  getForApprovalMeetings,
  forApprovals,
  loading,
  approveMeeting,
}) => {
  useEffect(() => {
    getForApprovalMeetings();
  }, [getForApprovalMeetings]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [MeetingId, setMeetingId] = useState(null);

  const handleApprove = () => {
    approveMeeting(MeetingId);
    handleClose();
  };

  const handleApproveClick = (id) => {
    setMeetingId(id);
    handleShow();
  };

  const adminApproval = forApprovals.map((forApproval) => (
    <tr key={forApproval.meetingId}>
      <td>{forApproval.description}</td>
      <td>{forApproval.officeName}</td>
      <td>{forApproval.contactName}</td>
      <td>
        <Moment format="YYYY/MM/DD h:mm A">{forApproval.dateCreated}</Moment>
      </td>
      <td>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-success mx-1"
            onClick={() => handleApproveClick(forApproval.meetingId)}
          >
            Approve
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h4 className="text-left">For your Approval</h4>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Office</th>
            <th>Submitted By</th>
            <th>Date Submitted</th>
          </tr>
        </thead>
        <tbody>{loading ? <ClockLoader /> : adminApproval}</tbody>
      </table>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Approve Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to Approve this meeting?</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-danger" onClick={handleApprove}>
            Yes, Approve
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

ForApprovalofAdmin.propTypes = {
  getForApprovalMeetings: PropTypes.func.isRequired,
  forApprovals: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  approveMeeting: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  forApprovals: state.meeting.forApproval,
  loading: state.meeting.loading,
});

export default connect(mapStateToProps, {
  getForApprovalMeetings,
  approveMeeting,
})(ForApprovalofAdmin);
