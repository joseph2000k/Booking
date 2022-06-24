import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAnnouncements } from "../../actions/announcements";

const Announcements = ({ getAnnouncements, announcements }) => {
  useEffect(() => {
    getAnnouncements();
  }, [getAnnouncements]);

  const allAnnouncements = announcements.map((announcement) => (
    <tr key={announcement._id}>
      <i className="fas fa-bullhorn"></i>&nbsp;&nbsp;
      <td>{announcement.text}</td>
    </tr>
  ));

  return (
    <Fragment>
      <span className="h5">Announcements</span>
      <p>{""}</p>
      <div>{allAnnouncements}</div>
    </Fragment>
  );
};

Announcements.propTypes = {
  getAnnouncements: PropTypes.func.isRequired,
  announcements: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  announcements: state.announcements.announcements,
});

export default connect(mapStateToProps, { getAnnouncements })(Announcements);
