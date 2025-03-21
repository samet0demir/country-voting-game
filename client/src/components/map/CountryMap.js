import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AuthContext } from '../../context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';

// NOT: GeoJSON verisi büyük olduğu için burada import etmeniz gerekecek
// import countriesGeoJson from '../../data/countries.geo.json';
// Alternatif olarak, şu şekilde çekebilirsiniz:
// Örnek: const [geoJsonData, setGeoJsonData] = useState(null);
// useEffect(() => { fetch('/countries.geo.json').then(res => res.json()).then(data => setGeoJsonData(data)); }, []);

const CountryMap = (props) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [countriesData, setCountriesData] = useState(props.countries);
  const [geoJsonData, setGeoJsonData] = useState(null);

  // GeoJSON verisi için
  useEffect(() => {
    // GeoJSON verisini public klasöründen çekiyoruz
    fetch('/countries.geo.json')
      .then(res => res.json())
      .then(data => setGeoJsonData(data))
      .catch(error => console.error("GeoJSON verisi yüklenemedi:", error));
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
  
  // Countries prop'u değiştiğinde state'i güncelle
  useEffect(() => {
    setCountriesData(props.countries);
  }, [props.countries]);

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
    const countryName = getMatchingCountryName(feature);
    return {
      fillColor: getCountryColor(countryName),
      weight: 1,
      opacity: 1,
      color: 'gray',
      fillOpacity: 0.7
    };
  };

  // Haritadan oy verme fonksiyonu
  const handleVoteFromMap = async (countryName) => {
    if (!isAuthenticated) {
      // Giriş yapma sayfasına yönlendir
      window.location.href = '/login';
      return;
    }
    
    try {
      await axios.post('/api/countries/vote', { country: countryName });
      // Verileri yenile ve bildirim göster
      if (props.refreshData) {
        props.refreshData();
      }
      alert(`${countryName} için oy verildi!`);
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Oy kaydedilirken bir hata oluştu.";
      alert(errorMessage);
    }
  };

  // GeoJSON ve countries.js arasında ülke adı eşleştirme yardımcı fonksiyonu
  const getMatchingCountryName = (feature) => {
    // GeoJSON'dan gelen isim seçenekleri
    const possibleNames = [
      feature.properties.NAME,
      feature.properties.name,
      feature.properties.NAME_LONG,
      feature.properties.NAME_EN
    ].filter(Boolean); // undefined/null değerleri kaldır
    
    // Eğer hiç isim bulunamadıysa boş değer döndür
    if (possibleNames.length === 0) return "";
    
    // Veri setimizde bulunan bir isimle eşleşme ara
    for (const possibleName of possibleNames) {
      // Tam eşleşme
      const exactMatch = countriesData.find(c => 
        c.name.toLowerCase() === possibleName.toLowerCase()
      );
      if (exactMatch) return exactMatch.name;
      
      // Kısmi eşleşme (X içinde Y kontrolü)
      const partialMatch = countriesData.find(c => 
        possibleName.toLowerCase().includes(c.name.toLowerCase()) || 
        c.name.toLowerCase().includes(possibleName.toLowerCase())
      );
      if (partialMatch) return partialMatch.name;
    }
    
    // Eşleşme bulunamadıysa ilk ismi döndür
    return possibleNames[0];
  };

  // Her ülke için popup içeriği
  const onEachFeature = (feature, layer) => {
    // Ülke adını veri setimizdeki adlarla eşleştir
    const countryName = getMatchingCountryName(feature);
    
    // Veri setinde eşleşen ülkeyi bul
    const country = countriesData.find(c => c.name === countryName);
    const votes = country ? country.votes_count : 0;
    
    // Popup içeriğini hazırla
    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
      <div>
        <h5>${countryName}</h5>
        <p>Oylar: ${votes}</p>
      </div>
    `;
    
    // Kullanıcı giriş yapmışsa ve son 2 saat içinde oy verdiyse bilgi mesajı göster
    if (isAuthenticated && props.votedToday) {
      const message = document.createElement('div');
      message.className = 'small text-warning mt-2';
      
      if (props.remainingTime > 0) {
        // Oy verme işleminin ne zaman tamamlanacağını hesapla
        const remainingMs = props.remainingTime;
        const now = new Date();
        const completeTime = new Date(now.getTime() + remainingMs);
        
        // Tamamlanma saati ve dakikası
        const completeHour = completeTime.getHours();
        const completeMinute = completeTime.getMinutes();
        
        // Kalan süreyi hesapla
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        
        // Format display values
        const displayHours = String(hours).padStart(2, '0');
        const displayMinutes = String(minutes).padStart(2, '0');
        const displaySeconds = String(seconds).padStart(2, '0');
        
        // Daha şık bir timer oluştur
        const timerHTML = `
          <div class="popup-timer text-center my-2">
            <p class="small text-muted mb-1">Yeniden oy kullanabilmek için kalan süre:</p>
            <div class="timer-display d-flex justify-content-center">
              <span class="timer-box bg-danger text-white px-2 py-1 rounded">${displayHours}</span>
              <span class="timer-sep px-1">:</span>
              <span class="timer-box bg-danger text-white px-2 py-1 rounded">${displayMinutes}</span>
              <span class="timer-sep px-1">:</span>
              <span class="timer-box bg-danger text-white px-2 py-1 rounded">${displaySeconds}</span>
            </div>
            <p class="small text-muted mt-1">(Saat ${completeHour}:${String(completeMinute).padStart(2, '0')} itibariyle)</p>
          </div>
        `;
        
        message.innerHTML = timerHTML;
      } else {
        message.innerText = 'Şu anda oy veremezsiniz';
      }
      
      popupContent.appendChild(message);
    } else {
      // Giriş yapmış veya yapmamış tüm kullanıcılar için oy verme butonu göster
      // Giriş yapmamış kullanıcı butona tıklayınca login sayfasına yönlendirilecek
      const voteButton = document.createElement('button');
      voteButton.className = 'btn btn-sm btn-success w-100';
      voteButton.innerText = 'Bu Ülkeye Oy Ver';
      voteButton.onclick = (e) => {
        e.preventDefault();
        layer.closePopup();
        handleVoteFromMap(countryName);
      };
      popupContent.appendChild(voteButton);
    }
    
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