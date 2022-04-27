import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addOffice } from "../../../actions/office";
import { setAlert } from "../../../actions/alert";

const AddOffice = ({ addOffice, setAlert }) => {
  const [formData, setFormData] = useState({});

  const { officeName, password, password2, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else if (role !== "user" && role !== "admin") {
      setAlert("Please select a valid role", "danger");
    } else {
      addOffice(formData);
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card card-body mt-5 shadow-sm p-3 mb-5 bg-white rounded">
              <h2 className="text-center">
                <i className="fas fa-user-plus"></i> Add Office
              </h2>
              <form onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                  <label>Office Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="officeName"
                    onChange={(e) => onChange(e)}
                    value={officeName}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    onChange={(e) => onChange(e)}
                    value={password}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password2"
                    onChange={(e) => onChange(e)}
                    value={password2}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-select"
                    name="role"
                    onChange={(e) => onChange(e)}
                    value={role}
                    required
                  >
                    <option selected>Please select a role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                &nbsp;
                <div className="form-group flex d-flex justify-content-center">
                  <input
                    type="submit"
                    value="Add Office"
                    className="btn btn-primary btn-block"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

AddOffice.propTypes = {
  addOffice: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { addOffice, setAlert })(AddOffice);
