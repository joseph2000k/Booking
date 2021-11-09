import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setMeeting } from "../../actions/meeting";
import { proceedScheduling } from "../../actions/authmeeting";
import { loadCurrentMeeting } from "../../actions/authmeeting";
import useToggle from "../../utils/useToggle";
import { getRooms } from "../../actions/rooms";
import MeetingRoomItem from "./MeetingRoomItem";

const ScheduleForm = ({ proceedScheduling, getRooms, room: { rooms } }) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const [formData, setFormData] = useState({
    specialInstructions: "",
    first: "",
    second: "",
  });

  const [value, toggleValue] = useToggle(false);

  const { specialInstructions, first, second } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className="h-title">Schedule a Meeting</h1>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          proceedScheduling(formData);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Write your special instructions here if any"
            name="specialInstructions"
            value={specialInstructions}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="first requirement"
            name="first"
            value={first}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="second requirement"
            name="second"
            value={second}
            onChange={onChange}
          />
        </div>
        <div>{value.toString()}</div>
        <input
          type="submit"
          value="Add Room and Date"
          onClick={toggleValue}
          className="btn btn-primary my-1"
          data-toggle="modal"
          data-target="#exampleModalCenter"
        />
      </form>

      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        Add Room and Schedule
      </button>

      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                Select a Room
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {rooms.map((room) => (
                <MeetingRoomItem key={room._id} room={room}></MeetingRoomItem>
              ))}
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

ScheduleForm.propTypes = {
  proceedScheduling: PropTypes.func.isRequired,
  loadCurrentMeeting: PropTypes.func.isRequired,
  getRooms: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  room: state.room,
});

export default connect(mapStateToProps, {
  proceedScheduling,
  loadCurrentMeeting,
  getRooms,
})(ScheduleForm);
