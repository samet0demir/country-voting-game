import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ChatBox from '../components/chat/ChatBox';

const CountryChat = () => {
  const { country } = useParams();
  const { user, loading } = useContext(AuthContext);
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is loaded and country doesn't match
    if (!loading && user && user.country !== country) {
      setAccessDenied(true);
    }
  }, [user, country, loading]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (accessDenied) {
    return (
      <div className="container">
        <div className="alert alert-danger mt-4">
          <h4 className="alert-heading">Erişim Engellendi!</h4>
          <p>Sadece kendi ülkenizin chat odasına erişebilirsiniz.</p>
          <hr />
          <p className="mb-0">
            <Link to={`/chat/country/${user.country}`} className="btn btn-primary me-2">
              {user.country} Chat'ine Git
            </Link>
            <Link to="/chat/global" className="btn btn-success me-2">
              Global Chat'e Git
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Dashboard'a Dön
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{country} Chat</h2>
        <div>
          <Link to="/dashboard" className="btn btn-secondary me-2">
            Back to Dashboard
          </Link>
          <Link to="/chat/global" className="btn btn-outline-primary">
            Global Chat
          </Link>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <ChatBox country={country} />
        </div>
      </div>
    </div>
  );
};

export default CountryChat;