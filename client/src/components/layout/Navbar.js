import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="nav fixed-top bg-info justify-content-between">
      <h2>
        <Link className="text-decoration-none link-secondary" to="/">
          <i className="fa fa-pencil-square-o w-bold" aria-hidden="true"></i>{" "}
          BookingSystem
        </Link>
      </h2>
      <ul>
        <Link className="text-decoration-none link-secondary" to="/login">
          <i class="fa fa-sign-in" aria-hidden="true"></i> Login
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
