import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i class="fa fa-pencil-square-o" aria-hidden="true"></i> BookingSystem
        </Link>
      </h1>
      <ul>
        <li>
          <Link to="/login">
            <i class="fa fa-sign-in" aria-hidden="true"></i> Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
