import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="container">
      <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">Country Voting Game</h1>
        <p className="lead">
          Welcome to the Country Voting Game! In this application, you can vote for your favorite countries
          and see which ones are the most popular among users.
        </p>
        <hr className="my-4" />
        <p>
          Join the community, vote for your favorite country once per day, and chat with other users
          in global and country-specific chat rooms!
        </p>
        {!isAuthenticated ? (
          <div className="d-flex gap-2">
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        ) : (
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        )}
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Vote for Countries</h5>
              <p className="card-text">
                Cast your vote for your favorite country once per day and see the results in real-time.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Interactive Map</h5>
              <p className="card-text">
                Explore an interactive world map showing which countries are getting the most votes.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Live Chat</h5>
              <p className="card-text">
                Chat with other users in global or country-specific chat rooms using our real-time chat feature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;