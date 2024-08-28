import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItineraryHomeStyles.css';

const ItineraryManager = () => {
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();

  const saveTitleAndPeriod = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/new-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, period }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const newItineraryId = data.id;
        navigate(`/itinerary/${newItineraryId}`);
      } else {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        console.error('Failed to save title and period:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saving title and period:', error);
    }
  };

  useEffect(() => {
    const fetchItinerariesFromServer = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/itineraries', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setItineraries(data.itineraries || []);
        } else {
          console.error('Failed to fetch itineraries:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };

    fetchItinerariesFromServer();
  }, []);

  const handleEditItinerary = (itineraryId) => {
    navigate(`/itinerary/${itineraryId}`);
  };

  return (
    <div>
      <h1>Itinerary Manager</h1>
      <div className="edit-title">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter itinerary title"
        />
        <input
          type="text"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="Enter period"
        />
        <button className='add-day-button' onClick={saveTitleAndPeriod}>Create New Itinerary</button>
      </div>

      <h2>Past Itineraries</h2>
      <div className="container">
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <div  onClick={() => handleEditItinerary(itinerary.id)} className="column" key={itinerary.id}>
              <h2>{itinerary.title}</h2>
              <div className="home-card">
                <p>Period: {itinerary.period}</p>
                <p>Last Edited: {new Date(itinerary.last_edited).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No itineraries found.</p>
        )}
      </div>
    </div>
  );
};

export default ItineraryManager;
