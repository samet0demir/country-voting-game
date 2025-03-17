import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import countries from '../data/countries';

const Profile = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nickname: '',
    country: ''
  });
  const [votingHistory, setVotingHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);
  const navigate = useNavigate();

  const [canChangeCountry, setCanChangeCountry] = useState(true);
  const [daysLeft, setDaysLeft] = useState(0);
  const [lastChangeDate, setLastChangeDate] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }

    // Load user data into form
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        country: user.country || ''
      });

      // Check if user can change country
      if (user.last_country_change) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const lastChange = new Date(user.last_country_change);
        setLastChangeDate(lastChange);
        
        if (lastChange > oneWeekAgo) {
          setCanChangeCountry(false);
          // Calculate days left
          const daysRemaining = 7 - Math.floor((new Date() - lastChange) / (1000 * 60 * 60 * 24));
          setDaysLeft(daysRemaining);
        } else {
          setCanChangeCountry(true);
        }
      }

      // Fetch voting history when user is loaded
      fetchVotingHistory();
    }
  }, [isAuthenticated, loading, navigate, user]);

  // Fetch the user's voting history
  const fetchVotingHistory = async () => {
    try {
      setHistoryLoading(true);
      console.log('Oy geçmişi alınıyor...');
      
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      };
      
      const res = await axios.get('/api/users/voting-history', config);
      console.log('Oy geçmişi alındı:', res.data);
      setVotingHistory(res.data);
      setHistoryLoading(false);
    } catch (err) {
      console.error('Oy geçmişi alınamadı:', err.response?.data || err.message);
      setError('Could not load voting history. Please try again later.');
      setHistoryLoading(false);
    }
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      };
      
      const res = await axios.put('/api/users/update', formData, config);
      
      setMessage('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
      setMessage('');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="my-4">Profile Settings</h2>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title m-0">Update Your Profile</h5>
            </div>
            <div className="card-body">
              {message && (
                <div className="alert alert-success">{message}</div>
              )}
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || ''}
                    disabled
                  />
                  <small className="form-text text-muted">Email cannot be changed</small>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Nickname</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nickname"
                    value={formData.nickname}
                    onChange={onChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <select
                    className="form-select"
                    name="country"
                    value={formData.country}
                    onChange={onChange}
                    required
                    disabled={!canChangeCountry}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {!canChangeCountry && (
                    <div className="form-text text-danger">
                      Ülke değişikliği 7 günde bir yapılabilir. {daysLeft} gün daha beklemelisiniz.
                      <br />
                      Son değişiklik: {lastChangeDate ? lastChangeDate.toLocaleDateString() : 'N/A'}
                    </div>
                  )}
                  {canChangeCountry && lastChangeDate && (
                    <div className="form-text text-success">
                      Ülkenizi değiştirebilirsiniz. Son değişiklik: {lastChangeDate.toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* New Voting History Card */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title m-0">
                <i className="bi bi-clock-history me-2"></i>Oy Verme Geçmişiniz
              </h5>
            </div>
            <div className="card-body">
              {historyLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : votingHistory.length === 0 ? (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Henüz hiçbir ülkeye oy vermediniz.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Ülke</th>
                        <th scope="col">Oy Tarihi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votingHistory.map((vote, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <span className="d-flex align-items-center">
                              <i className="bi bi-flag-fill me-2 text-danger"></i>
                              {vote.country}
                            </span>
                          </td>
                          <td>{new Date(vote.vote_date).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {votingHistory.length > 0 && (
              <div className="card-footer bg-light">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  En son oylarınız en üstte gösterilmektedir.
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;