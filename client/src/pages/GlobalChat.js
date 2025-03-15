import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ChatBox from '../components/chat/ChatBox';
import { AuthContext } from '../context/AuthContext';

const GlobalChat = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Global Chat</h2>
        <div>
          <Link to="/dashboard" className="btn btn-secondary me-2">
            Back to Dashboard
          </Link>
          {user && user.country && (
            <Link to={`/chat/country/${user.country}`} className="btn btn-outline-primary">
              {user.country} Chat
            </Link>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;