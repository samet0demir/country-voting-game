import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
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
  const { theme } = useContext(ThemeContext);
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
        <div className="card shadow">
          <div className="card-header bg-primary text-white d-flex align-items-center">
            <i className="bi bi-person-plus-fill me-2"></i>
            <h4 className="mb-0">Hesap Oluştur</h4>
          </div>
          <div className="card-body">
            {localError && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {localError}
              </div>
            )}
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-envelope me-2"></i>E-posta Adresi
                </label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-at"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-person me-2"></i>Kullanıcı Adı
                </label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person-badge"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    name="nickname"
                    value={nickname}
                    onChange={onChange}
                    required
                    placeholder="Görünecek isminizi yazın"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-key me-2"></i>Şifre
                </label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength="6"
                    placeholder="En az 6 karakter olmalı"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-check-circle me-2"></i>Şifre Onayı
                </label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    required
                    minLength="6"
                    placeholder="Şifrenizi tekrar girin"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-calendar3 me-2"></i>Yaş (İsteğe bağlı)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="age"
                      value={age}
                      onChange={onChange}
                      min="0"
                      placeholder="Yaşınız"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-gender-ambiguous me-2"></i>Cinsiyet (İsteğe bağlı)
                    </label>
                    <select
                      className="form-select"
                      name="gender"
                      value={gender}
                      onChange={onChange}
                    >
                      <option value="">Cinsiyet seçin</option>
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">
                  <i className="bi bi-globe me-2"></i>Ülke
                </label>
                <select
                  className="form-select"
                  name="country"
                  value={country}
                  onChange={onChange}
                  required
                >
                  <option value="">Ülkenizi seçin</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2">
                <i className="bi bi-person-plus-fill me-2"></i>Hesap Oluştur
              </button>
              <div className="text-center mt-3">
                <span className={theme === 'dark' ? 'text-light' : 'text-dark'}>Zaten hesabınız var mı?</span>
                <Link to="/login" className="ms-2">Giriş Yap</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;