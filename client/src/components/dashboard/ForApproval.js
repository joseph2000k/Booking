import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";

const ForApproval = ({ meetings, loading, deleteMeeting }) => {
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
          onClick={() => deleteMeeting(meeting._id)}
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
    </Fragment>
  );
};

ForApproval.propTypes = {
  meetings: PropTypes.array.isRequired,
};

export default connect(null, null)(ForApproval);
