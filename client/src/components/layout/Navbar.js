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

  const SuperUserLinks = (
    <Fragment>
      <Link className="dropdown-item text-decoration-none link-dark" to={""}>
        Add Office
      </Link>
      <Link className="dropdown-item text-decoration-none link-dark" to={""}>
        Delete Office
      </Link>
      <Link className="dropdown-item text-decoration-none link-dark" to={""}>
        Manage Office Role
      </Link>
      <Link className="dropdown-item text-decoration-none link-dark" to={""}>
        Delete Room
      </Link>
    </Fragment>
  );

  //map through rooms and display them in dropdown-item links
  const roomLinks = rooms.map((room) => (
    <Link
      key={room._id}
      to={`/rooms/${room._id}`}
      className="dropdown-item text-decoration-none link-dark"
    >
      {room.name}
      {/* <div className='dropdown-divider'></div> */}
    </Link>
  ));

  return (
    <nav className="nav fixed-top bg-info justify-content-between">
      <h2 className="d-flex align-items-center">
        <Link className="text-decoration-none link-light mx-4" to="/">
          <i className="fa fa-pencil-square-o w-bold" aria-hidden="true"></i>{" "}
          BookingSystem
        </Link>
      </h2>

      <div className="d-flex align-items-center">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle link-light"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Rooms
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            {roomLinks}
          </div>
        </li>
        {office != null && isAuthenticated && office.role === "admin" ? (
          <Fragment>
            <span className="text-light">|</span>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle link-light"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Admin
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                {SuperUserLinks}
              </div>
            </li>
          </Fragment>
        ) : null}

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
