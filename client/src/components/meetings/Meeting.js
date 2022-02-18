import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getMeeting } from "../../actions/meeting";
import PropTypes from "prop-types";

const Meeting = ({ getMeeting, match }) => {
  useEffect(() => {
    getMeeting(match.params.id);
  }, [getMeeting, match.params.id]);
  return (
    <div>
      <h1>Meeting</h1>
    </div>
  );
};

Meeting.propTypes = {
  getMeeting: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  meeting: state.meeting.meeting,
});

export default connect(mapStateToProps, { getMeeting })(Meeting);
