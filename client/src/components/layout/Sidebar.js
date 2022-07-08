import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { getRooms } from "../../actions/rooms";

const Sidebar = ({
  getRooms,
  rooms,
  auth: { isSendingRequest, isAuthenticated, office },
}) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const roomLinks = rooms.map((room) => (
    <MenuItem key={room._id}>
      <Link to={`/rooms/${room._id}`}>{room.name}</Link>
    </MenuItem>
  ));

  return (
    <ProSidebar className="position-fixed top-0 start-0 mt-4">
      <div className="mt-4 sidebar-line-height">
        <Menu>
          {isAuthenticated && (
            <MenuItem icon={<i className="fa fa-home" />}>
              <Link to="/dashboard">Dashboard</Link>
            </MenuItem>
          )}
          {isAuthenticated && (
            <MenuItem icon={<i className="fa fa-calendar" />}>
              <Link to="/create-meeting">Schedule a Meeting</Link>
            </MenuItem>
          )}
          <SubMenu
            defaultOpen="true"
            title="Rooms"
            icon={<i className="fa fa-door-open" />}
          >
            {roomLinks}
          </SubMenu>
          {office !== null &&
          !isSendingRequest &&
          isAuthenticated &&
          (office.role === "admin" || office.role === "manager") ? (
            <SubMenu
              defaultOpen="true"
              title="Announcements"
              icon={<i className="fa fa-bullhorn" />}
            >
              <MenuItem>
                <Link to={`/myannouncements/${office._id}`}>
                  My Announcements
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/make-announcement">Make Announcement</Link>
              </MenuItem>
            </SubMenu>
          ) : null}

          {office !== null && isAuthenticated && office.role === "admin" ? (
            <SubMenu
              defaultOpen="true"
              title="Offices"
              icon={<i className="fa fa-building" />}
            >
              <MenuItem>
                <Link to={`/add-office`}>Add Office</Link>
              </MenuItem>
              <MenuItem>
                <Link to={`/manage-office`}>Manage Office</Link>
              </MenuItem>
            </SubMenu>
          ) : null}
        </Menu>
      </div>
    </ProSidebar>
  );
};

Sidebar.propTypes = {
  auth: PropTypes.object.isRequired,
  getRooms: PropTypes.func.isRequired,
  rooms: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  rooms: state.room.rooms,
});

export default connect(mapStateToProps, { getRooms })(Sidebar);
