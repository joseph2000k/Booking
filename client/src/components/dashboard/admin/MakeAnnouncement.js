import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { postAnnouncement } from "../../../actions/announcements";
import { useHistory } from "react-router-dom";

const MakeAnnouncement = ({ postAnnouncement }) => {
  const history = useHistory();

  const [formData, setFormData] = useState({});

  const { text } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    postAnnouncement(formData, history);
  };

  return (
    <div className="container-component">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card card-body mt-5 shadow-sm p-3 mb-5 bg-white">
            <div className="d-flex justify-content-center">
              <h3>Make Announcement</h3>
            </div>
            <div>
              <form onSubmit={(e) => onSubmit(e)}>
                <textarea
                  className="form-control text-area"
                  onChange={(e) => onChange(e)}
                  name="text"
                  rows="10"
                  placeholder="Enter announcement here"
                  value={text}
                ></textarea>
                <div className="d-flex justify-content-center">
                  <input
                    type="submit"
                    value={"Post"}
                    className="btn btn-primary mt-2 submit-button"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MakeAnnouncement.propTypes = {
  postAnnouncement: PropTypes.func.isRequired,
};

export default connect(null, { postAnnouncement })(MakeAnnouncement);
