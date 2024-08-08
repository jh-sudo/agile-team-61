import React, { useState } from 'react';
import WeatherModal from '../components/WeatherModal';
import './WeatherModalStyles.css';

const WeatherButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button className="open-modal-button" onClick={openModal}>
        Check for weather <i class="fa-solid fa-cloud-sun"></i>
      </button>
      <WeatherModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default WeatherButton;
