import React, { useEffect, Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getMeetings } from "../../actions/meeting";
import ClockLoader from "react-spinners/ClockLoader";
import History from "./History";
import ForApproval from "./ForApproval";
import ForApprovalofAdmin from "./admin/ForApprovalofAdmin";
import Announcements from "./Announcements";
import { getForApprovalMeetings } from "../../actions/meeting";
import { clearSubmitMeetings } from "../../actions/meeting";
import { getSchedules } from "../../actions/meeting";
import UpcomingMeetings from "./UpcomingMeetings";
import moment from "moment";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Badge from "react-bootstrap/Badge";

const Dashboard = ({
  getForApprovalMeetings,
  auth: { office, isSendingRequest },
  getMeetings,
  getSchedules,
  clearSubmitMeetings,
  meeting: { loading, schedules },
  meetings,
  adminApproval,
  deleteMeeting,
}) => {
  const [selectedTab, setSelectedTab] = useState(null);
  useEffect(() => {
    getForApprovalMeetings();
    getMeetings();
    clearSubmitMeetings();
    getSchedules();
  }, [getForApprovalMeetings, getMeetings, clearSubmitMeetings, getSchedules]);

  const [activeTab, setActiveTab] = useState("upcomingMeetings");

  const forApproval = meetings.filter(
    (meeting) => meeting.isApproved === false && meeting.isNotPending === false
  );

  const historyMeetings = [];
  const upcomingMeetings = [];
  for (let i = 0; i < schedules.length; i++) {
    if (
      moment(schedules[i].start).isAfter(moment()) &&
      schedules[i].isApproved &&
      schedules[i].isCancelled === false
    ) {
      upcomingMeetings.push(schedules[i]);
    } else if (
      moment(schedules[i].end).isBefore(moment()) &&
      schedules[i].isApproved &&
      schedules[i].isCancelled === false
    ) {
      historyMeetings.push(schedules[i]);
    }
  }

  const forApprovalBadge =
    forApproval.length > 0 ? (
      <Fragment>
        For Approval{" "}
        {forApproval.length > 0 && (
          <Badge bg="primary">{forApproval.length}</Badge>
        )}
      </Fragment>
    ) : (
      "For Approval"
    );

  const upcomingMeetingBadge =
    upcomingMeetings.length > 0 ? (
      <Fragment>
        Upcoming Meetings{" "}
        {upcomingMeetings.length > 0 && (
          <Badge bg="primary">{upcomingMeetings.length}</Badge>
        )}
      </Fragment>
    ) : (
      "Upcoming Meetings"
    );

  const adminApporvalBadge =
    adminApproval.length > 0 ? (
      <Fragment>
        Upcoming Meetings{" "}
        {adminApproval.length > 0 && (
          <Badge bg="primary">{adminApproval.length}</Badge>
        )}
      </Fragment>
    ) : (
      "Upcoming Meetings"
    );

  return office === null || isSendingRequest || loading ? (
    <div className="d-flex justify-content-center">
      <ClockLoader />
    </div>
  ) : (
    <div className="d-flex flex-row container-component">
      <div className="position-fixed top-0 start-0 mt-4"></div>
      <div className="dashboard-tab shadow-sm p-3 mb-5 mx-0 bg-white rounded">
        <Fragment>
          <div>
            <h3 className="text-center">Dashboard</h3>
            <Link to="create-meeting">
              <button className="btn btn-primary shadow m-3 position-fixed bottom-0 end-0">
                <h5>
                  <i class="fa fa-pencil-square" aria-hidden="true"></i>{" "}
                  Schedule a Meeting
                </h5>
              </button>
            </Link>
          </div>

          <Tabs
            {...((office.role === "admin" || office.role === "manager") &&
            adminApproval.length > 0
              ? {
                  activeKey:
                    selectedTab === null && adminApproval.length > 0
                      ? "forApprovalofAdmin"
                      : activeTab,
                }
              : {
                  activeKey:
                    selectedTab === null && forApproval.length > 0
                      ? "forApproval"
                      : activeTab,
                })}
            onSelect={(key) => {
              setSelectedTab(!null);
              setActiveTab(key);
            }}
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="upcomingMeetings" title={upcomingMeetingBadge}>
              {upcomingMeetings.length > 0 && (
                <UpcomingMeetings
                  upcoming={upcomingMeetings.sort((a, b) =>
                    moment(a.start).isAfter(moment(b.start)) ? 1 : -1
                  )}
                />
              )}
            </Tab>
            <Tab eventKey="forApprovalofAdmin" title={adminApporvalBadge}>
              {(office.role === "admin" || office.role === "manager") &&
              adminApproval.length > 0 ? (
                <ForApprovalofAdmin />
              ) : null}
            </Tab>
            <Tab eventKey="forApproval" title={forApprovalBadge}>
              {forApproval.length > 0 && <ForApproval meetings={forApproval} />}
            </Tab>

            <Tab eventKey="history" title="History">
              {historyMeetings.length > 0 && (
                <History
                  history={historyMeetings
                    .sort((a, b) =>
                      moment(a.start).isAfter(moment(b.start)) ? -1 : 1
                    )
                    .slice(0, 5)}
                  loading={loading}
                />
              )}
            </Tab>
          </Tabs>
        </Fragment>
      </div>
      <div className="announcement shadow-sm p-3 mb-5 bg-white rounded">
        <Announcements />
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  getMeetings: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
  clearSubmitMeetings: PropTypes.func.isRequired,
  meetings: PropTypes.array.isRequired,
  getSchedules: PropTypes.func.isRequired,
  adminApproval: PropTypes.array.isRequired,
  getForApprovalMeetings: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  meeting: state.meeting,
  adminApproval: state.meeting.forApproval,
  meetings: state.meeting.meetings,
});

export default connect(mapStateToProps, {
  getMeetings,
  clearSubmitMeetings,
  getForApprovalMeetings,
  getSchedules,
})(Dashboard);
