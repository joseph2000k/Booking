import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getMeeting } from "../../actions/meeting";
import PropTypes from "prop-types";
import ClockLoader from "react-spinners/ClockLoader";

const Meeting = ({ getMeeting, meeting: { loading, meeting }, match }) => {
  useEffect(() => {
    getMeeting(match.params.id);
  }, [getMeeting, match.params.id]);

  return meeting === null || meeting._id !== match.params.id || loading ? (
    <div className="d-flex justify-content-center">
      <ClockLoader size={50} color={"#123abc"} />
    </div>
  ) : (
    <div>
      <h1>{meeting.office.officeName}</h1>
    </div>
  );
};

Meeting.propTypes = {
  getMeeting: PropTypes.func.isRequired,
  meeting: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  meeting: state.meeting,
});

export default connect(mapStateToProps, { getMeeting })(Meeting);
