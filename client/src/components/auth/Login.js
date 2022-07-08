import React, { useEffect, Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { login } from "../../actions/auth";
import { clearMeetings } from "../../actions/meeting";
import ClockLoader from "react-spinners/ClockLoader";

const Login = ({ login, isAuthenticated, clearMeetings, isSendingRequest }) => {
  useEffect(() => {
    clearMeetings();
  }, [clearMeetings]);

  const [formData, setFormData] = useState({
    officeName: "",
    password: "",
  });

  const { officeName, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(officeName, password);
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return isSendingRequest === true ? (
    <ClockLoader />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Office Name"
            name="officeName"
            value={officeName}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: propTypes.func.isRequired,
  isAuthenticated: propTypes.bool,
  isSendingRequest: propTypes.bool,
  clearMeetings: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isSendingRequest: state.auth.isSendingRequest,
});

export default connect(mapStateToProps, { login, clearMeetings })(Login);
