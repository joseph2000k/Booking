import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";

const ForApproval = ({ meetings, loading }) => {
  const allMeetings = meetings.map((meeting) => (
    <tr key={meeting._id}>
      <td>{meeting.description}</td>
      <td>
        <Moment format="YYYY/MM/DD h:mm A">{meeting.dateCreated}</Moment>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="text-left">For Approval</h2>
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

ForApproval.propTypes = {
  meetings: PropTypes.array.isRequired,
};

export default connect(null, null)(ForApproval);
