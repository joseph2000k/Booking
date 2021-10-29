import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Dashboard = (props) => {
  return (
    <div>
      <Link to="create-meeting">
        <h4 className="btn btn-primary">Schedule Meeting</h4>
      </Link>
    </div>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
