import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setMeeting } from "../../actions/meeting";

const ScheduleForm = ({ setMeeting }) => {
  const [formData, setFormData] = useState({
    specialInstructions: "",
    first: "",
    second: "",
  });

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
          setMeeting(formData);
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
        <input type="submit" className="btn btn-primary my-1" />
      </form>
    </Fragment>
  );
};

ScheduleForm.propTypes = {
  setMeeting: PropTypes.func.isRequired,
};

export default connect(null, { setMeeting })(ScheduleForm);
