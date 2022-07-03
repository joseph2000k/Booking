import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { getRooms } from '../../actions/rooms';

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
    <ProSidebar className='position-fixed top-0 start-0 mt-4'>
      <div className='mt-4'>
        <Menu>
          {isAuthenticated && (
            <MenuItem icon={<i className='fa fa-home' />}>
              <Link to='/dashboard'>Dashboard</Link>
            </MenuItem>
          )}
          <SubMenu
            defaultOpen='true'
            title='Rooms'
            icon={<i className='fa fa-door-open' />}
          >
            {roomLinks}
          </SubMenu>
          {office !== null &&
          !isSendingRequest &&
          isAuthenticated &&
          (office.role === 'admin' || office.role === 'manager') ? (
            <SubMenu
              defaultOpen='true'
              title='Announcements'
              icon={<i className='fa fa-bullhorn' />}
            >
              <MenuItem>
                <Link to='/myannoncements'>My Announcements</Link>
              </MenuItem>
              <MenuItem>
                <Link to='/createannouncement'>Create Announcement</Link>
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
