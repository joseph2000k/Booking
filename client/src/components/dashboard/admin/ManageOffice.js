import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getOfficeList, deleteOffice } from '../../../actions/office';

const ManageOffice = ({ getOfficeList, offices, deleteOffice }) => {
  useEffect(() => {
    getOfficeList();
  }, [getOfficeList]);

  const handleDelete = (id) => {
    deleteOffice(id);
  };
  //sort office by name
  const sortedOffice = offices.sort((a, b) => {
    if (a.officeName < b.officeName) {
      return -1;
    }
    if (a.officeName > b.officeName) {
      return 1;
    }
    return 0;
  });

  const officeList = sortedOffice.map((office) => (
    <tr key={office._id}>
      <td>{office.officeName}</td>
      <td>{office.role}</td>
      <div className='d-flex justify-content-end'>
        <td>
          <button
            className='btn btn-danger mx-1'
            onClick={() => handleDelete(office._id)}
          >
            Delete
          </button>
        </td>
      </div>
    </tr>
  ));

  return (
    <Fragment>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 mx-auto'>
            <div className='card card-body mt-5 shadow-sm p-3 mb-5 bg-white rounded'>
              <h2 className='text-center'>
                <i className='fas fa-user-plus'></i> Manage Office
              </h2>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>Office Name</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>{officeList}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

ManageOffice.propTypes = {
  getOfficeList: PropTypes.func.isRequired,
  deleteOffice: PropTypes.func.isRequired,
  offices: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  offices: state.office.officeList,
});

export default connect(mapStateToProps, { getOfficeList, deleteOffice })(
  ManageOffice
);
