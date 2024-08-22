import React, { useState, useEffect } from 'react';
import { getTravelAdvisories } from './AdvisoryAPI';
import './AdvisoryDataStyles.css';
import WeatherButton from '../components/WeatherButton';

const AdvisoriesData = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        const data = await getTravelAdvisories();
        const advisoriesArray = Object.keys(data.data).map(code => ({
          ...data.data[code],
          code,
        }));
        setAdvisories(advisoriesArray);
      } catch (error) {
        console.error('Error fetching travel advisories:', error);
        setError('Failed to fetch travel advisories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const displayedAdvisories = advisories.slice(0, 3);

  return (
    <>
      <div className="advisory-header">
        <div className="advisorytitle">
          <div><h2>Travel Advisories</h2></div>
          <WeatherButton />
        </div>
      </div>
      <div className="cards-container">
        {displayedAdvisories.map((advisory, index) => (
          <div className="card" key={index}>
            <h3>{advisory.name}</h3>
            <p><strong>Continent:</strong> {advisory.continent}</p>
            <p><strong>{advisory.advisory.message}</strong></p>
            <p><strong>Updated:</strong> {advisory.advisory.updated}</p>
            <a className="readmore" href={advisory.advisory.source} target="_blank" rel="noopener noreferrer">Click here to read more</a>
          </div>
        ))}
      </div>
      <div className="see-all">
        <a className="see-all-button" href="/AllAdvisories">See All</a>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </>
  );
};

export default AdvisoriesData;
