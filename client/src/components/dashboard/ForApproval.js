import React, { Fragment, useState } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClockLoader from 'react-spinners/ClockLoader';
import Modal from 'react-bootstrap/Modal';
import { deleteMeeting } from '../../actions/meeting';

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
        <Moment format='YYYY/MM/DD h:mm A'>{meeting.dateCreated}</Moment>
      </td>
      <div className='d-flex justify-content-end'>
        <td>
          <Link to={`meeting/view/${meeting._id}`} className='btn btn-primary'>
            View
          </Link>
        </td>
        <td>
          <button
            className='btn btn-danger mx-1'
            onClick={() => handleDeleteClick(meeting._id)}
          >
            Delete
          </button>
        </td>
      </div>
    </tr>
  ));
  return (
    <Fragment>
      <h4 className='text-left'>Waiting For Approval of Admin</h4>
      <table className='table table-striped'>
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
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this meeting?</p>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-secondary' onClick={handleClose}>
            Close
          </button>
          <button className='btn btn-danger' onClick={handleDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

ForApproval.propTypes = {
  meetings: PropTypes.array.isRequired,
  deleteMeeting: PropTypes.func.isRequired,
};

export default connect(null, { deleteMeeting })(ForApproval);
