import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setMeeting } from "../../actions/meeting";
import { proceedScheduling } from "../../actions/authmeeting";
import { loadCurrentMeeting } from "../../actions/authmeeting";
import useToggle from "../../utils/useToggle";

const ScheduleForm = ({ proceedScheduling }) => {
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
        />
      </form>
      {/* <div>
        <div>{value.toString()}</div>
        <button onClick={toggleValue}>Toggle</button>
      </div> */}
    </Fragment>
  );
};

ScheduleForm.propTypes = {
  proceedScheduling: PropTypes.func.isRequired,
  loadCurrentMeeting: PropTypes.func.isRequired,
};

export default connect(null, { proceedScheduling, loadCurrentMeeting })(
  ScheduleForm
);
