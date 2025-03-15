import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import countries from '../data/countries';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    nickname: '',
    age: '',
    gender: '',
    country: ''
  });

  const { email, password, password2, nickname, age, gender, country } = formData;
  const { register, isAuthenticated, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (password !== password2) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (!country) {
      setLocalError('Please select your country');
      return;
    }
    
    const success = await register({
      email,
      password,
      nickname,
      age: age !== '' ? parseInt(age) : null,
      gender,
      country
    });
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="row">
      <div className="col-md-6 mx-auto">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4>Register</h4>
          </div>
          <div className="card-body">
            {localError && (
              <div className="alert alert-danger">{localError}</div>
            )}
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nickname</label>
                <input
                  type="text"
                  className="form-control"
                  name="nickname"
                  value={nickname}
                  onChange={onChange}
                  required
                  placeholder="Choose a display name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Age (Optional)</label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={age}
                  onChange={onChange}
                  min="0"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Gender (Optional)</label>
                <select
                  className="form-select"
                  name="gender"
                  value={gender}
                  onChange={onChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Country</label>
                <select
                  className="form-select"
                  name="country"
                  value={country}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;