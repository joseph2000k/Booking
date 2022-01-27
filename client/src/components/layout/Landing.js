import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Rooms from '../rooms/Rooms';
import PropTypes from 'prop-types';
import ClockLoader from 'react-spinners/ClockLoader';

const Landing = ({ isAuthenticated, isSendingRequest }) => {
  if (isAuthenticated && !isSendingRequest) {
    return <Redirect to='/dashboard' />;
  }
  return isSendingRequest ? (
    <div className='d-flex justify-content-center'>
      <ClockLoader />
    </div>
  ) : (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <p className='lead'>
            <Rooms />
          </p>
          {/* <div className="buttons">
            <a href="register.html" className="btn btn-primary">
              Sign Up
            </a>
            <a href="login.html" className="btn btn-light">
              Login
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isSendingRequest: state.auth.isSendingRequest,
});

export default connect(mapStateToProps)(Landing);
