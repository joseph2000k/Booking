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

                  <h5>Number of Attendees</h5>
                  <p>{meeting.numberOfAttendees}</p>

                  <h5>Requirements</h5>
                  <p>{meeting.firstRequirements}</p>
                  <p>{meeting.secondRequirements}</p>

                  <h5>Instructions</h5>
                  <p>{meeting.specialInstructions}</p>
                </div>

                <div className="col-md-6">
                  <h5>Schedules</h5>
                  <ul>
                    {meeting.schedules.map((schedule) => (
                      <li key={schedule._id}>
                        <Moment format="MMMM Do YYYY">{schedule.start}</Moment>
                        {", "}
                        <Moment format="h:mm a">{schedule.start}</Moment> -{" "}
                        <Moment format="h:mm a">{schedule.end}</Moment>-{" "}
                        {schedule.room.name}
                      </li>
                    ))}
                  </ul>
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
