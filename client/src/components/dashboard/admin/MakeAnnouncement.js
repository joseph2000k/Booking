import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const MakeAnnouncement = ({}) => {
  return (
    <div className="container-component">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card card-body mt-5 shadow-sm p-3 mb-5 bg-white">
            <h3>Make Announcement</h3>
            <div>
              <form>
                <textarea
                  className="form-control text-area"
                  name="announcement"
                  rows="10"
                  placeholder="Enter announcement here"
                ></textarea>
                <div className="d-flex justify-content-center">
                  <input
                    type="submit"
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

export default connect(null, {})(MakeAnnouncement);
