import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        const newItineraryId = data.id; // Assuming the response contains the new itinerary ID
        navigate(`/itinerary/${newItineraryId}`); // Redirect to the edit page of the new itinerary
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
      <h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter itinerary title"
        />
      </h1>
      <h3>
        <input
          type="text"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="Enter period"
        />
      </h3>
      <div>
        <button onClick={saveTitleAndPeriod}>Create New Itinerary</button>
      </div>

      <h2>Past Itineraries</h2>
      <div>
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <div key={itinerary.id} onClick={() => handleEditItinerary(itinerary.id)}>
              <h3>{itinerary.title}</h3>
              <p>Period: {itinerary.period}</p>
              <p>Last Edited: {new Date(itinerary.last_edited).toLocaleDateString()}</p>
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
