import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import PropTypes from "prop-types";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
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
            <a className="dropdown-item" href="#">
              Action
            </a>
            <a className="dropdown-item" href="#">
              Another action
            </a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">
              Something else here
            </a>
          </div>
        </li>
        {!loading && (
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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
