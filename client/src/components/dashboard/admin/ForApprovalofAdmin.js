import React, { Fragment, useState, useEffect } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";
import { getForApprovalMeetings } from "../../../actions/meeting";
import { approveMeeting } from "../../../actions/meeting";

const ForApprovalofAdmin = ({
  getForApprovalMeetings,
  forApprovals,
  loading,
  approveMeeting,
}) => {
  useEffect(() => {
    getForApprovalMeetings();
  }, [getForApprovalMeetings]);

  const adminApproval = forApprovals.map((forApproval) => (
    <tr key={forApproval.meetingId}>
      <td>{forApproval.description}</td>
      <td>{forApproval.contactName}</td>
      <td>
        <Moment format="YYYY/MM/DD h:mm A">{forApproval.dateCreated}</Moment>
      </td>
      <td>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-success mx-1"
            onClick={() => approveMeeting(forApproval.meetingId)}
          >
            Approve
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Submitted By</th>
            <th>Date Submitted</th>
          </tr>
        </thead>
        <tbody>{loading ? <ClockLoader /> : adminApproval}</tbody>
      </table>
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
