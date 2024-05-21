import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-image-set">
      <div>
        <h1 className="text-white home ">WELCOME TO USER MANAGEMENT SYSTEM</h1>
        <Link to="/login">
          <button className="btn btn-secondary home-button">Log in</button>
        </Link>
        <Link to="/signup">
          <button className="btn btn-secondary home-button">New User</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;