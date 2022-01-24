import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";

const ToApprovedMeeting = ({ history, loading }) => {
  const allMeetings = history.map((meeting) => (
    <tr key={meeting._id}>
      <td>{meeting.description}</td>
      <td>{meeting.dateCreated}</td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="text-left">History</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>{loading ? <ClockLoader /> : allMeetings}</tbody>
      </table>
    </Fragment>
  );
};

ToApprovedMeeting.propTypes = {
  meetings: PropTypes.array.isRequired,
};

export default connect(null, null)(ToApprovedMeeting);
