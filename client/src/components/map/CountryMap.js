import React, { useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AuthContext } from '../../context/AuthContext';

// Fix for marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Simplified country coordinates (these should be more accurate in a real application)
const countryCoordinates = {
  'USA': [37.0902, -95.7129],
  'Germany': [51.1657, 10.4515],
  'France': [46.2276, 2.2137],
  'Japan': [36.2048, 138.2529],
  'Brazil': [-14.2350, -51.9253],
  'Australia': [-25.2744, 133.7751],
  'India': [20.5937, 78.9629],
  'Turkey': [38.9637, 35.2433],
  'Canada': [56.1304, -106.3468],
  'China': [35.8617, 104.1954],
  'Russia': [61.5240, 105.3188],
  'UK': [55.3781, -3.4360],
};

const CountryMap = ({ countries }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
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
      
      {countries.map(country => {
        const coordinates = countryCoordinates[country.name];
        
        if (!coordinates) return null;
        
        // Check if this country matches user's country for chat access
        const canAccessChat = isAuthenticated && user && user.country === country.name;
        
        return (
          <Marker 
            key={country.id || country.name} 
            position={coordinates}
          >
            <Popup>
              <div>
                <h5>{country.name}</h5>
                <p>Votes: {country.votes_count}</p>
                
                {canAccessChat ? (
                  <Link 
                    to={`/chat/country/${country.name}`} 
                    className="btn btn-sm btn-primary"
                  >
                    Join Chat
                  </Link>
                ) : isAuthenticated ? (
                  <div className="small text-muted mt-2">
                    Sadece kendi ülkenizin chat'ine erişebilirsiniz
                  </div>
                ) : (
                  <div className="small text-muted mt-2">
                    Chat'e erişmek için giriş yapmalısınız
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default CountryMap;