import React, { useEffect } from "react";
import Moment from "react-moment";
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
      {
        //wrap in a container with card
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h3>{meeting.office.officeName}</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Meeting description</h5>
                  <p>{meeting.description}</p>

                  <h5>Contact name</h5>
                  <p>{meeting.contactName}</p>

                  <h5>Contact number</h5>
                  <p>{meeting.contactNumber}</p>

                  <h5>Number of attendees</h5>
                  <p>{meeting.numberOfAttendees}</p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      }
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
