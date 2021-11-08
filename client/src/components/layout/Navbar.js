import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='nav fixed-top bg-info justify-content-between'>
      <h2 className='d-flex align-items-center'>
        <Link className='text-decoration-none link-light mx-4' to='/'>
          <i className='fa fa-pencil-square-o w-bold' aria-hidden='true'></i>{' '}
          BookingSystem
        </Link>
      </h2>
      <div className='d-flex align-items-center'>
        <Link className='text-decoration-none link-light mx-4 ' to='/login'>
          <i class='fa fa-sign-in' aria-hidden='true'></i> Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
