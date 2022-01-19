import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import PropTypes from "prop-types";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul className="navbar-nav ml-auto">
      {/* <li className="nav-item">
        <Link className="nav-link" to="/dashboard">
          Dashboard
        </Link>
      </li> */}
      <li>
        <a onClick={logout} href="#!" className="nav-link">
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="text-dark">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <div className="d-flex align-items-center">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
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

      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}

      {/* <div className='d-flex align-items-center'>
        <Link className='text-decoration-none link-light mx-4 ' to='/login'>
          <i class='fa fa-sign-in' aria-hidden='true'></i> Login
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
