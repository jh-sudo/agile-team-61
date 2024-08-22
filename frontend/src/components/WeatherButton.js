import React, { useState } from 'react';
import WeatherModal from '../components/WeatherModal';
import './WeatherModalStyles.css';

const WeatherButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button className="check-weather-button" onClick={openModal}>
        Check for weather <i className="fa-solid fa-cloud-sun"></i>
      </button>
      <WeatherModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default WeatherButton;
