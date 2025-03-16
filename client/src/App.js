import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CountryChat from './pages/CountryChat';
import GlobalChat from './pages/GlobalChat';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container my-4 flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <Dashboard />
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/chat/country/:country" 
                  element={
                    <PrivateRoute>
                      <CountryChat />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/chat/global" 
                  element={
                    <PrivateRoute>
                      <GlobalChat />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <footer className="bg-primary text-light py-4 mt-4">
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Dünya Haritası Oy Sistemi</h5>
                    <p>Bu platformda ülkelere oy verebilir ve istatistikleri görüntüleyebilirsiniz.</p>
                  </div>
                  <div className="col-md-3">
                    <h5>Bağlantılar</h5>
                    <ul className="list-unstyled">
                      <li><a href="/" className="text-light">Ana Sayfa</a></li>
                      <li><a href="/dashboard" className="text-light">Harita</a></li>
                      <li><a href="/profile" className="text-light">Profil</a></li>
                    </ul>
                  </div>
                  <div className="col-md-3">
                    <h5>İletişim</h5>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-envelope me-2"></i> info@dunyaharitasi.com</li>
                      <li><i className="bi bi-telephone me-2"></i> +90 555 123 4567</li>
                    </ul>
                  </div>
                </div>
                <hr className="bg-light" />
                <div className="text-center">
                  <p className="mb-0">&copy; {new Date().getFullYear()} Dünya Haritası Oy Sistemi. Tüm hakları saklıdır.</p>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
