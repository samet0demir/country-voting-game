import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div className="container">
      <div className={`hero-section text-center py-5 rounded ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
        <div className="py-5">
          <i className="bi bi-globe-americas display-1 text-primary mb-4"></i>
          <h1 className="display-4 fw-bold mb-3">Dünya Haritası Oy Sistemi</h1>
          <p className="lead mb-4 mx-auto" style={{maxWidth: '700px'}}>
            En sevdiğiniz ülkelere oy verin, dünya haritasında popüler ülkeleri keşfedin ve gerçek zamanlı sonuçları takip edin!
          </p>
          
          {!isAuthenticated ? (
            <div className="d-flex gap-3 justify-content-center mt-4">
              <Link to="/register" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-person-plus me-2"></i>Kayıt Ol
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg px-4">
                <i className="bi bi-box-arrow-in-right me-2"></i>Giriş Yap
              </Link>
            </div>
          ) : (
            <div className="d-flex gap-3 justify-content-center mt-4">
              <Link to="/dashboard" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-map me-2"></i>Haritaya Git
              </Link>
              <Link to="/profile" className="btn btn-outline-primary btn-lg px-4">
                <i className="bi bi-person me-2"></i>Profilim
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-5 g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm stats-card">
            <div className="card-body text-center p-4">
              <div className="icon-circle bg-primary text-white mb-4 mx-auto">
                <i className="bi bi-check2-square"></i>
              </div>
              <h5 className="card-title">Ülkelere Oy Verin</h5>
              <p className="card-text">
                Her gün favori ülkenize oy verin ve gerçek zamanlı olarak sonuçları görün.
                En popüler ülkeleri takip edin!
              </p>
              <Link to="/dashboard" className="btn btn-sm btn-outline-primary mt-3">
                <i className="bi bi-arrow-right me-1"></i>Hemen Oy Ver
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm stats-card">
            <div className="card-body text-center p-4">
              <div className="icon-circle bg-success text-white mb-4 mx-auto">
                <i className="bi bi-map"></i>
              </div>
              <h5 className="card-title">İnteraktif Harita</h5>
              <p className="card-text">
                Hangi ülkelerin en çok oy aldığını gösteren interaktif dünya haritasını keşfedin.
                Ülkelere tıklayarak detayları görüntüleyin.
              </p>
              <Link to="/dashboard" className="btn btn-sm btn-outline-success mt-3">
                <i className="bi bi-globe me-1"></i>Haritayı Keşfet
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm stats-card">
            <div className="card-body text-center p-4">
              <div className="icon-circle bg-info text-white mb-4 mx-auto">
                <i className="bi bi-chat-dots"></i>
              </div>
              <h5 className="card-title">Canlı Sohbet</h5>
              <p className="card-text">
                Global veya ülkeye özel sohbet odalarında diğer kullanıcılarla gerçek zamanlı olarak 
                sohbet edin ve fikir alışverişinde bulunun.
              </p>
              {isAuthenticated ? (
                <Link to="/chat/global" className="btn btn-sm btn-outline-info mt-3">
                  <i className="bi bi-chat me-1"></i>Sohbete Katıl
                </Link>
              ) : (
                <Link to="/login" className="btn btn-sm btn-outline-info mt-3">
                  <i className="bi bi-box-arrow-in-right me-1"></i>Giriş Yapın
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Nasıl Çalışır Bölümü */}
      <div className="how-it-works py-5 mt-5">
        <h2 className="text-center mb-4">
          <i className="bi bi-info-circle me-2"></i>
          Nasıl Çalışır?
        </h2>
        <div className="row g-4">
          <div className="col-md-3">
            <div className="step text-center">
              <div className="step-number">1</div>
              <h5 className="mt-3">Kayıt Olun</h5>
              <p>Hızlıca hesap oluşturun ve sisteme giriş yapın.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="step text-center">
              <div className="step-number">2</div>
              <h5 className="mt-3">Ülke Seçin</h5>
              <p>Listeden veya haritadan favori ülkenizi seçin.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="step text-center">
              <div className="step-number">3</div>
              <h5 className="mt-3">Oy Verin</h5>
              <p>Her gün bir ülkeye oy kullanabilirsiniz.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="step text-center">
              <div className="step-number">4</div>
              <h5 className="mt-3">Sonuçları Görün</h5>
              <p>Harita ve grafiklerle oy sonuçlarını takip edin.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;