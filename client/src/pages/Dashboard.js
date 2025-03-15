import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryMap from '../components/map/CountryMap';
import VotingChart from '../components/VotingChart';
import allCountries from '../data/countries';

const Dashboard = () => {
  const [countries, setCountries] = useState([]);
  const [votingCountry, setVotingCountry] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votedToday, setVotedToday] = useState(false);

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
      // Use the new dedicated endpoint to check if user has voted
      const token = localStorage.getItem('token');
      
      if (token) {
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        const res = await axios.get('/api/countries/check-voted', config);
        setVotedToday(res.data.hasVoted);
        
        if (res.data.hasVoted) {
          setMessage(`You have already voted for ${res.data.votedCountry} today`);
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
      setMessage('You must be logged in to vote');
      return;
    }
    
    try {
      setLoading(true);
      await axios.post('/api/countries/vote', { country: votingCountry });
      
      // Refresh countries list
      fetchCountries();
      
      setMessage('Vote recorded successfully!');
      setVotedToday(true);
      setLoading(false);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to record vote');
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchCountries();
    checkVotedToday();
  };
  
  if (loading && countries.length === 0) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Dashboard</h2>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title m-0">Vote for a Country</h5>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleVote}>
                <div className="mb-3">
                  <label className="form-label">Select Country</label>
                  <select
                    className="form-select"
                    value={votingCountry}
                    onChange={(e) => setVotingCountry(e.target.value)}
                    disabled={votedToday}
                  >
                    <option value="">Select a country</option>
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
                  disabled={votedToday || !localStorage.getItem('token')}
                >
                  {votedToday 
                    ? 'You have already voted today' 
                    : !localStorage.getItem('token')
                      ? 'Log in to vote'
                      : 'Vote'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title m-0">Voting Statistics</h5>
            </div>
            <div className="card-body">
              <VotingChart countries={countries} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title m-0">Interactive Map</h5>
              <p className="text-white small m-0 mt-1">Click on a country marker to view details and vote directly from the map</p>
            </div>
            <div className="card-body p-0">
              <CountryMap 
                countries={countries} 
                votedToday={votedToday} 
                refreshData={refreshData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;