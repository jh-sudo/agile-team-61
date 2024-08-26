import './ItineraryStyles.css';
import React, { useState, useEffect } from 'react';

const ItineraryContent = () => {
  const [itinerary, setItinerary] = useState({});
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [editableTitle, setEditableTitle] = useState('');
  const [editablePeriod, setEditablePeriod] = useState('');

  useEffect(() => {
    const fetchItineraryFromServer = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/itinerary', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setItinerary(data.itinerary || {});
          setTitle(data.itineraryTitle || '');
          setPeriod(data.itineraryPeriod || '');
          setEditableTitle(data.itineraryTitle || '');
          setEditablePeriod(data.itineraryPeriod || '');
        } else {
          console.error('Failed to fetch itinerary:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching itinerary:', error);
      }
    };

    fetchItineraryFromServer();
  }, []);

  const saveTitleAndPeriod = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/save-title-period', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editableTitle, period: editablePeriod }),
        credentials: 'include',
      });
  
      if (response.ok) {
        alert('Title and period saved');
        setTitle(editableTitle);
        setPeriod(editablePeriod);
      } else {
        console.error('Failed to save title and period:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saving title and period:', error);
    }
  };
  

  const handleSaveItineraryItem = async (id, day, title, details) => {
    try {
      const response = await fetch('http://localhost:3001/api/save-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title, details }),
        credentials: 'include', 
      });

      if (response.ok) {
        alert('Itinerary item saved');
      } else {
        console.error('Failed to save itinerary item:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saving itinerary item:', error);
    }
  };

  const addNewItem = async (day) => {
    const title = prompt('Enter title:');
    const details = prompt('Enter details:');

    try {
      const response = await fetch('http://localhost:3001/api/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day, title, details }),
        credentials: 'include',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to add item:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const addNewDay = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/add-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day: Object.keys(itinerary).length + 1 }),
        credentials: 'include', 
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to add new day:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding new day:', error);
    }
  };

  return (
    <div>
      <div className="edit-title">
        <h1
          contentEditable
          onInput={(e) => setEditableTitle(e.target.innerText)}
        >
          {title}
        </h1>
        <h3
          contentEditable
          onInput={(e) => setEditablePeriod(e.target.innerText)}
        >
          {period}
        </h3>
        <button onClick={saveTitleAndPeriod}>Save</button>
      </div>

      <button onClick={addNewDay}>+ Add Day</button>

      <div className="container">
        {Object.keys(itinerary).map((dayKey, index) => (
          <div className="column" key={index}>
            <h2>Day {index + 1}</h2>
            {itinerary[dayKey].map((item) => (
              <div className="card" key={item.id}>
                <h3
                  contentEditable
                  onInput={(e) =>
                    setEditableTitle(e.target.innerText)
                  }
                >
                  {item.title}
                </h3>
                <p
                  contentEditable
                  onInput={(e) =>
                    setEditablePeriod(e.target.innerText)
                  }
                >
                  {item.details}
                </p>
                <button
                  onClick={() =>
                    handleSaveItineraryItem(
                      item.id,
                      index + 1,
                      editableTitle,
                      editablePeriod
                    )
                  }
                >
                  Save
                </button>
              </div>
            ))}
            <button onClick={() => addNewItem(index + 1)}>+ Add Item</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryContent;
