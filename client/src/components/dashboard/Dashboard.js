import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMeetings } from '../../actions/meeting';
import ClockLoader from 'react-spinners/ClockLoader';
import History from './History';
import ForApproval from './ForApproval';
import ForApprovalofAdmin from './admin/ForApprovalofAdmin';
import { getForApprovalMeetings } from '../../actions/meeting';
import { clearSubmitMeetings } from '../../actions/meeting';
import { getSchedules } from '../../actions/meeting';
import UpcomingMeetings from './UpcomingMeetings';
import moment from 'moment';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

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
  useEffect(() => {
    getForApprovalMeetings();
    getMeetings();
    clearSubmitMeetings();
    getSchedules();
  }, [getForApprovalMeetings, getMeetings, clearSubmitMeetings, getSchedules]);

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

  return office === null || isSendingRequest || loading ? (
    <div className='d-flex justify-content-center'>
      <ClockLoader />
    </div>
  ) : (
    <Fragment>
      <div>
        <h3 className='text-center'>{office.officeName} Dashboard</h3>
        <Link to='create-meeting'>
          <button className='btn btn-primary shadow m-3 position-fixed bottom-0 end-0'>
            <h5>
              <i class='fa fa-pencil-square' aria-hidden='true'></i> Schedule a
              Meeting
            </h5>
          </button>
        </Link>
      </div>

      <Tabs
        defaultActiveKey='upcomingMeetings'
        id='uncontrolled-tab-example'
        className='mb-3'
      >
        <Tab eventKey='upcomingMeetings' title='Upcoming Meetings'>
          {upcomingMeetings.length > 0 && (
            <UpcomingMeetings
              upcoming={upcomingMeetings.sort((a, b) =>
                moment(a.start).isAfter(moment(b.start)) ? 1 : -1
              )}
            />
          )}
        </Tab>
        <Tab eventKey='forApprovalofAdmin' title='For Your Approval'>
          {(office.role === 'admin' || office.role === 'manager') &&
          adminApproval.length > 0 ? (
            <ForApprovalofAdmin />
          ) : null}
        </Tab>
        <Tab eventKey='forApproval' title='For Approval'>
          {forApproval.length > 0 && <ForApproval meetings={forApproval} />}
        </Tab>

        <Tab eventKey='history' title='History'>
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
