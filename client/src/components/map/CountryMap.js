import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AuthContext } from '../../context/AuthContext';
import io from 'socket.io-client';

// NOT: GeoJSON verisi büyük olduğu için burada import etmeniz gerekecek
// import countriesGeoJson from '../../data/countries.geo.json';
// Alternatif olarak, şu şekilde çekebilirsiniz:
// Örnek: const [geoJsonData, setGeoJsonData] = useState(null);
// useEffect(() => { fetch('/countries.geo.json').then(res => res.json()).then(data => setGeoJsonData(data)); }, []);

const CountryMap = ({ countries }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [countriesData, setCountriesData] = useState(countries);
  const [geoJsonData, setGeoJsonData] = useState(null);

  // GeoJSON verisi için
  useEffect(() => {
    // GeoJSON verisi burada yüklenecek - örnek olarak import edildiğini varsayıyoruz
    // Gerçek uygulamada bu dosyayı public klasörüne ekleyip fetch ile çekebilirsiniz
    // fetch('/countries.geo.json').then(res => res.json()).then(data => setGeoJsonData(data));
    
    // Şimdilik örnek için boş bir obje kullanıyoruz
    setGeoJsonData({ type: "FeatureCollection", features: [] });
  }, []);

  // Socket.io bağlantısı
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    // Oy güncellemelerini dinle
    newSocket.on('voteUpdate', (updatedCountries) => {
      setCountriesData(updatedCountries);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Ülkelerin oy verilerine göre renk hesaplama
  const getCountryColor = (countryName) => {
    const country = countriesData.find(c => c.name === countryName);
    
    // Eğer ülke bulunamadıysa veya oy yoksa beyaz döndür
    if (!country || country.votes_count === 0) {
      return '#FFFFFF'; // Beyaz
    }
    
    // En yüksek oy sayısını bul
    const maxVotes = Math.max(...countriesData.map(c => c.votes_count));
    
    // Oy oranını hesapla (0-1 arası)
    const voteRatio = country.votes_count / maxVotes;
    
    // Renk gradyan hesaplama
    // Koyu kırmızıdan (#800000) açık pembeye (#FFE4E1) doğru
    
    // Renk bileşenlerini ayır
    const startColor = {
      r: 128, // #80 in RGB
      g: 0,   // #00 in RGB
      b: 0    // #00 in RGB
    };
    
    const endColor = {
      r: 255, // #FF in RGB
      g: 228, // #E4 in RGB
      b: 225  // #E1 in RGB
    };
    
    // Renk değerlerini hesapla
    const r = Math.floor(startColor.r + (endColor.r - startColor.r) * (1 - voteRatio));
    const g = Math.floor(startColor.g + (endColor.g - startColor.g) * (1 - voteRatio));
    const b = Math.floor(startColor.b + (endColor.b - startColor.b) * (1 - voteRatio));
    
    // RGB'yi HEX'e dönüştür
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // GeoJSON stil fonksiyonu
  const style = (feature) => {
    return {
      fillColor: getCountryColor(feature.properties.name),
      weight: 1,
      opacity: 1,
      color: 'gray',
      fillOpacity: 0.7
    };
  };

  // Her ülke için popup içeriği
  const onEachFeature = (feature, layer) => {
    const countryName = feature.properties.name;
    const country = countriesData.find(c => c.name === countryName);
    const votes = country ? country.votes_count : 0;
    
    // Popup içeriğini hazırla
    const popupContent = `
      <div>
        <h5>${countryName}</h5>
        <p>Votes: ${votes}</p>
        ${isAuthenticated && user && user.country === countryName ? 
          `<a href="/chat/country/${countryName}" class="btn btn-sm btn-primary">Join Chat</a>` : 
          isAuthenticated ? 
          `<div class="small text-muted mt-2">Sadece kendi ülkenizin chat'ine erişebilirsiniz</div>` :
          `<div class="small text-muted mt-2">Chat'e erişmek için giriş yapmalısınız</div>`
        }
      </div>
    `;
    
    layer.bindPopup(popupContent);
  };

  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        noWrap={true}
      />
      
      {geoJsonData && (
        <GeoJSON 
          data={geoJsonData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default CountryMap;