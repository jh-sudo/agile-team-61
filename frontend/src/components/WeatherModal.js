import React, { useState } from 'react';
import './WeatherModalStyles.css';

import humidityImg from '../assets/humidity.png';
import windspeedImg from '../assets/windspeed.png';

const WeatherModal = ({ isOpen, onClose }) => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const getWeather = async () => {
    const apiKey = '83855b62b3dacde9c933c831553da2b0';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setWeatherData(null);
      setError('Error: ' + error.message);
    }
  };

  const renderWeatherDetails = () => {
    if (error) {
      return <p>{error}</p>;
    }

    if (!weatherData) {
      return null;
    }

    const weatherImageSrc = getWeatherImage(weatherData.weather[0].main);
    const weatherImageAlt = weatherData.weather[0].description;

    return (
      <div className="weather-details">
        <div className="weather-icon">
          <img src={weatherImageSrc} alt={weatherImageAlt} />
        </div>
        <span className="temperature">{weatherData.main.temp}°C</span><br />
        <span className="city">{weatherData.name}</span><br />
        <div className="weather-info">
          <div className="info-block">
            <span className="value">
              <img src={humidityImg} alt="Humidity" className="weather-icon-small" />
              {weatherData.main.humidity}%
            </span>
            <span className="label">Humidity</span>
          </div>
          <div className="info-block">
            <span className="value">
              <img src={windspeedImg} alt="Wind Speed" className="weather-icon-small" />
              {weatherData.wind.speed} m/s
            </span>
            <span className="label">Wind Speed</span>
          </div>
        </div>
      </div>
    );
  };

  const getWeatherImage = (mainWeather) => {
    switch (mainWeather) {
      case 'Clouds':
        return require('../assets/cloud.png');
      case 'Thunderstorm':
        return require('../assets/thunderstorm.png');
      case 'Drizzle':
        return require('../assets/drizzle.png');
      case 'Rain':
        return require('../assets/rain.png');
      case 'Snow':
        return require('../assets/snow.png');
      case 'Atmosphere':
        return require('../assets/atmosphere.png');
      case 'Clear':
        return require('../assets/clear.png');
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <input 
          type="text" 
          placeholder="Enter city name" 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
          style={{ margin: '20px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%' }}
        />
        <button 
          onClick={getWeather} 
          className="get-weather-button"
        >
          Get Weather
        </button>
        {renderWeatherDetails()}
      </div>
    </div>
  );
};

export default WeatherModal;
