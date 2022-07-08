import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getMyAnnouncements } from "../../../actions/announcements";

const MyAnnouncements = ({ getMyAnnouncements, match }) => {
  useEffect(() => {
    getMyAnnouncements(match.params.id);
  }, [getMyAnnouncements, match.params.id]);

  return (
    <Fragment>
      <div className="container-component">
        This is the My Announcements page
      </div>
    </Fragment>
  );
};

MyAnnouncements.propTypes = {
  getMyAnnouncements: PropTypes.func.isRequired,
  myAnnouncements: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  myAnnouncements: state.announcements.myAnnouncements,
});

export default connect(mapStateToProps, { getMyAnnouncements })(
  MyAnnouncements
);
