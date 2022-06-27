import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

const Sidebar = ({}) => {
  return (
    <ProSidebar className="position-fixed top-0 start-0 mt-4">
      <div className="mt-4">
        <Menu>
          <MenuItem icon={<i className="fa fa-home" />}>
            <Link to="/">Home</Link>
          </MenuItem>
          <MenuItem icon={<i className="fa fa-door-open" />}>
            <Link to="/rooms">Rooms</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/meetings">Meetings</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/dashboard">Dashboard</Link>
          </MenuItem>
        </Menu>
      </div>
    </ProSidebar>
  );
};

export default connect(null, {})(Sidebar);
