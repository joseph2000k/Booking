import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { getRooms } from "../../actions/rooms";
import PropTypes from "prop-types";

const Navbar = ({
  auth: { isAuthenticated, isSendingRequest, office },
  getRooms,
  rooms,
  logout,
}) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const authLinks = (
    <div className="d-flex align-items-center">
      <a
        onClick={logout}
        href="#!"
        className="text-decoration-none link-light mx-4"
      >
        <i className="fas fa-sign-out-alt"></i> Logout
      </a>
    </div>
  );

  const guestLinks = (
    <div className="d-flex align-items-center">
      <Link className="text-decoration-none link-light mx-4 " to="/login">
        <i class="fa fa-sign-in" aria-hidden="true"></i> Login
      </Link>
    </div>
  );

  return (
    <nav className="nav fixed-top bg-info justify-content-between">
      <h2 className="d-flex align-items-center">
        <Link className="text-decoration-none link-light mx-4" to="/">
          <i className="fa fa-pencil-square-o w-bold" aria-hidden="true"></i>{" "}
          BookingSystem
        </Link>
      </h2>
      <div className="d-flex align-items-center">
        {office !== null && isAuthenticated && !isSendingRequest && (
          <Fragment>
            <div className="office-name-navbar-background">
              <div className="office-name-navbar">{office.officeName}</div>
            </div>
          </Fragment>
        )}
        {!isSendingRequest && (
          <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
        )}
      </div>

      {/* <div className='d-flex align-items-center'>
        <Link className='text-decoration-none link-light mx-4 ' to='/login'>
          <i className='fa fa-sign-in' aria-hidden='true'></i> Login
        </Link>
      </div> */}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  rooms: PropTypes.object.isRequired,
  getRooms: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  rooms: state.room.rooms,
});

export default connect(mapStateToProps, { logout, getRooms })(Navbar);
