import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const ToApprovedMeeting = ({ meetings }) => {
  const allMeetings = meetings.map((meeting) => (
    <tr key={meeting._id}>
      <td>{meeting.description}</td>
      <td>{meeting.dateCreated}</td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="text-center">To Approved Meetings</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>{allMeetings}</tbody>
      </table>
    </Fragment>
  );
};

ToApprovedMeeting.propTypes = {
  meetings: PropTypes.array.isRequired,
};

export default connect(null, null)(ToApprovedMeeting);
