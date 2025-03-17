import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryMap from '../components/map/CountryMap';
import VotingChart from '../components/VotingChart';
import VoteCountdownTimer from '../components/VoteCountdownTimer';
import allCountries from '../data/countries';

const Dashboard = () => {
  const [countries, setCountries] = useState([]);
  const [votingCountry, setVotingCountry] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votedToday, setVotedToday] = useState(false);
  const [lastVoteTime, setLastVoteTime] = useState(null);
  const [nextVoteTime, setNextVoteTime] = useState(null);

  const fetchCountries = async () => {
    try {
      const res = await axios.get('/api/countries/stats');
      setCountries(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch countries');
      setLoading(false);
    }
  };

  const checkVotedToday = async () => {
    try {
      // Use the dedicated endpoint to check if user has voted
      const token = localStorage.getItem('token');
      
      if (token) {
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        const res = await axios.get('/api/countries/check-voted', config);
        console.log('Check voted response:', res.data);
        
        setVotedToday(res.data.hasVoted);
        
        if (res.data.hasVoted) {
          setMessage(`Son oyunuzu ${res.data.votedCountry} için kullandınız`);
          setLastVoteTime(res.data.lastVoteTime);
          setNextVoteTime(res.data.nextVoteTime);
          
          console.log('Vote countdown info:', {
            lastVoteTime: res.data.lastVoteTime,
            nextVoteTime: res.data.nextVoteTime
          });
        } else {
          setLastVoteTime(null);
          setNextVoteTime(null);
        }
      }
    } catch (err) {
      console.error('Error checking vote status:', err);
    }
  };

  useEffect(() => {
    // Fetch countries for everyone (even non-logged in users)
    fetchCountries();
    
    // Set up interval to refresh data every 5 seconds
    const intervalId = setInterval(fetchCountries, 5000);
    
    // Only check if voted when there is a token (user is logged in)
    if (localStorage.getItem('token')) {
      checkVotedToday();
      
      // Set up interval to check vote status every minute
      const voteCheckInterval = setInterval(checkVotedToday, 60000);
      
      // Clean up the vote check interval
      return () => {
        clearInterval(intervalId);
        clearInterval(voteCheckInterval);
      };
    }
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleVote = async (e) => {
    e.preventDefault();
    
    if (!votingCountry) {
      setMessage('Please select a country');
      return;
    }
    
    // Check if user is logged in
    if (!localStorage.getItem('token')) {
      // Redirect to login page instead of just showing a message
      window.location.href = '/login';
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/api/countries/vote', { country: votingCountry });
      console.log('Vote response:', response.data);
      
      // Refresh countries list
      fetchCountries();
      
      setMessage('Oy başarıyla kaydedildi!');
      setVotedToday(true);
      setLastVoteTime(response.data.lastVoteTime);
      setNextVoteTime(response.data.nextVoteTime);
      setLoading(false);
    } catch (err) {
      console.log('Vote error response:', err.response?.data);
      
      if (err.response?.data?.lastVoteTime && err.response?.data?.nextVoteTime) {
        setLastVoteTime(err.response.data.lastVoteTime);
        setNextVoteTime(err.response.data.nextVoteTime);
      }
      setMessage(err.response?.data?.msg || 'Failed to record vote');
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchCountries();
    checkVotedToday();
  };
  
  // Check if the user can vote again by comparing next vote time with current time
  const canVoteAgain = !votedToday || (nextVoteTime && new Date() >= new Date(nextVoteTime));
  
  if (loading && countries.length === 0) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  console.log('Rendering dashboard with:', {
    votedToday, 
    canVoteAgain, 
    nextVoteTime,
    lastVoteTime
  });

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0"><i className="bi bi-map-fill me-2"></i>Dünya Haritası</h2>
        
        {votedToday && !canVoteAgain && (
          <div className="badge bg-warning p-2 d-flex align-items-center">
            <i className="bi bi-hourglass-split me-2"></i>
            Oy hakkınız için bekliyorsunuz
          </div>
        )}
        
        {canVoteAgain && (
          <div className="badge bg-success p-2 d-flex align-items-center">
            <i className="bi bi-check-circle me-2"></i>
            Oy verebilirsiniz!
          </div>
        )}
      </div>
      
      {message && (
        <div className={`alert ${message.includes('başarıyla') ? 'alert-success' : 'alert-warning'} alert-dismissible fade show`}>
          <i className={`bi ${message.includes('başarıyla') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
        </div>
      )}
      
      <div className="row">
        {/* Ana harita kartı */}
        <div className="col-lg-8 order-lg-2">
          <div className="card mb-4 map-container">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title m-0">
                  <i className="bi bi-globe me-2"></i>
                  İnteraktif Dünya Haritası
                </h5>
                <p className="text-white small m-0 mt-1">
                  <i className="bi bi-info-circle me-1"></i>
                  Ülkelere tıklayarak detayları görüntüleyin ve oy verin
                </p>
              </div>
              <button 
                className="btn btn-sm btn-outline-light" 
                onClick={refreshData}
                title="Verileri yenile"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <div className="card-body p-0">
              <CountryMap 
                countries={countries} 
                votedToday={votedToday && !canVoteAgain} 
                refreshData={refreshData}
                message={message}
              />
            </div>
          </div>
        </div>
        
        {/* Yan panel */}
        <div className="col-lg-4 order-lg-1">
          {/* Oy verme kartı */}
          <div className="card mb-4 stats-card">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title m-0">
                <i className="bi bi-check2-square me-2"></i>
                Ülke Seçimi
              </h5>
            </div>
            <div className="card-body">
              {votedToday && !canVoteAgain && nextVoteTime && (
                <div className="mb-3 p-3 bg-light rounded">
                  <VoteCountdownTimer nextVoteTime={nextVoteTime} />
                </div>
              )}
              
              <form onSubmit={handleVote}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-flag me-1"></i>
                    Oy Vermek İstediğiniz Ülke
                  </label>
                  <select
                    className="form-select"
                    value={votingCountry}
                    onChange={(e) => setVotingCountry(e.target.value)}
                    disabled={votedToday && !canVoteAgain}
                  >
                    <option value="">Bir ülke seçin</option>
                    {allCountries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={votedToday && !canVoteAgain}
                >
                  {votedToday && !canVoteAgain 
                    ? <><i className="bi bi-hourglass-split me-2"></i>Oy hakkınız için bekliyorsunuz</> 
                    : <><i className="bi bi-hand-thumbs-up me-2"></i>Seçilen Ülkeye Oy Ver</>}
                </button>
              </form>
              
              {votedToday && !canVoteAgain && lastVoteTime && (
                <div className="small text-muted mt-2">
                  <i className="bi bi-clock-history me-1"></i>
                  Son oy: {new Date(lastVoteTime).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          
          {/* İstatistik kartı */}
          <div className="card mb-4 stats-card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="card-title m-0">
                <i className="bi bi-bar-chart-fill me-2"></i>
                Oy İstatistikleri
              </h5>
              <span className="badge bg-light text-primary">
                {countries.length > 0 ? countries.reduce((a, b) => a + (b.votes_count || 0), 0) : 0} oy
              </span>
            </div>
            <div className="card-body">
              {loading && countries.length === 0 ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <VotingChart countries={countries} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;