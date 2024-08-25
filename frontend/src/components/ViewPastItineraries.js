import React, { useEffect, useState } from 'react';

function ViewPastItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItineraries() {
      try {
        const response = await fetch('http://localhost:3001/api/past-itineraries', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included with the request
        });

        if (response.status === 401) {
          setError('Unauthorized. Please log in.');
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setItineraries(data);
      } catch (error) {
        console.error('Failed to fetch itineraries:', error);
        setError('Failed to fetch itineraries');
      }
    }

    fetchItineraries();
  }, []);

  return (
    <div>
      <h1>Past Itineraries</h1>
      {error && <p>{error}</p>}
      <ul>
        {itineraries.map((itinerary) => (
          <li key={itinerary.id}>
            <h2>{itinerary.title}</h2>
            <p>Date of Trip: {itinerary.period}</p>
            <p>Last Edited: {new Date(itinerary.last_edited).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewPastItineraries;
