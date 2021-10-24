import React from 'react';
import Rooms from '../rooms/Rooms';

const Landing = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <p className='lead'>
            <Rooms />
          </p>
          <div className='buttons'>
            <a href='register.html' className='btn btn-primary'>
              Sign Up
            </a>
            <a href='login.html' className='btn btn-light'>
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
