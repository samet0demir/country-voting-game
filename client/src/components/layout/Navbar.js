import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const authLinks = (
    <ul className="navbar-nav ms-auto">
      {user && (
        <li className="nav-item dropdown">
          <a 
            className="nav-link dropdown-toggle" 
            href="#" 
            id="userDropdown" 
            role="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <i className="bi bi-person-circle me-1"></i>
            {user.nickname || user.email}
          </a>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <Link className="dropdown-item" to="/profile">
                <i className="bi bi-person me-2"></i>Profil
              </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <a href="#!" className="dropdown-item" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>Çıkış
              </a>
            </li>
          </ul>
        </li>
      )}
      <li className="nav-item">
        <Link className="nav-link" to="/chat/global">
          <i className="bi bi-chat-dots me-1"></i>Global Chat
        </Link>
      </li>
      {user && user.country && (
        <li className="nav-item">
          <Link className="nav-link" to={`/chat/country/${user.country}`}>
            <i className="bi bi-flag me-1"></i>Ülke Sohbeti
          </Link>
        </li>
      )}
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav ms-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          <i className="bi bi-person-plus me-1"></i>Kayıt Ol
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link btn btn-outline-light btn-sm ms-2 px-3 py-1 mt-1" to="/login">
          <i className="bi bi-box-arrow-in-right me-1"></i>Giriş Yap
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-globe-americas me-2"></i>
          Dünya Haritası Oy Sistemi
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/"><i className="bi bi-house-door me-1"></i>Ana Sayfa</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard"><i className="bi bi-map me-1"></i>Harita</Link>
            </li>
          </ul>
          
          {/* Tema değiştirme düğmesi */}
          <div className="theme-toggle d-flex align-items-center me-3">
            <button 
              onClick={toggleTheme} 
              className="btn btn-sm text-light"
              aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? (
                <i className="bi bi-moon-stars-fill"></i>
              ) : (
                <i className="bi bi-brightness-high-fill"></i>
              )}
            </button>
          </div>
          
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;