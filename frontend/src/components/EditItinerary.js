import './ItineraryStyles.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // to get ID from URL

const EditItinerary = () => {
  const { itineraryId } = useParams(); // Get the itinerary ID from the URL
  const [itinerary, setItinerary] = useState({});
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [editableTitle, setEditableTitle] = useState('');
  const [editablePeriod, setEditablePeriod] = useState('');
  const [editableDetails, setEditableDetails] = useState(''); // Add state for editable details

  // Fetch the specific itinerary using the itineraryId
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/itinerary/${itineraryId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log the data to inspect its structure
          setItinerary(data.itinerary || {});
          setTitle(data.itineraryTitle || '');
          setPeriod(data.itineraryPeriod || '');
        } else {
          console.error('Failed to fetch itinerary:', response.status, response.statusText);
          alert(`Failed to fetch itinerary: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching itinerary:', error);
        alert('Error fetching itinerary. Please try again later.');
      }
    };

    fetchItinerary();
  }, [itineraryId]);

  const saveTitleAndPeriod = async () => {
    try {
      // Ensure we don't send empty values for unchanged fields
      const titleToSave = editableTitle.trim() || title;
      const periodToSave = editablePeriod.trim() || period;
  
      // Check if both fields have values
      if (!titleToSave || !periodToSave) {
        alert('Both title and period are required.');
        return;
      }
  
      const response = await fetch(`http://localhost:3001/api/save-title-period/${itineraryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: titleToSave, period: periodToSave }),
        credentials: 'include',
      });
  
      if (response.ok) {
        alert('Title and period saved');
        setTitle(titleToSave);  // Update with the saved title
        setPeriod(periodToSave); // Update with the saved period
      } else {
        console.error('Failed to save title and period:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        alert(`Failed to save title and period: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving title and period:', error);
      alert('Error saving title and period. Please try again later.');
    }
  };

  const handleSaveItineraryItem = async (id, day, newTitle, newDetails) => {
    console.log('going into saving:', { id, day, newTitle, newDetails });
  
    // Find the item from the itinerary state to get existing values
    const existingItem = Object.values(itinerary).flat().find(item => item.id === id);
  
    // Use existing values if new values are empty
    const titleToSave = newTitle.trim() || existingItem.title;
    const detailsToSave = newDetails.trim() || existingItem.details;
  
    try {
      // Check for empty or undefined values
      if (!day || !titleToSave || !detailsToSave) {
        alert('Day, title, and details are required.');
        return;
      }
  
      const response = await fetch(`http://localhost:3001/api/save-itinerary/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day, title: titleToSave, details: detailsToSave }),
        credentials: 'include',
      });
  
      if (response.ok) {
        alert("Activity title/detail saved");
      } else {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        alert(`Failed to save itinerary item: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving itinerary item:', error);
      alert('Error saving itinerary item. Please try again later.');
    }
  };
  

  const addNewItem = async (day) => {
    const title = prompt('Enter title:');
    const details = prompt('Enter details:');

    if (!title || !details) {
      alert('Title and details cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/add-item/${itineraryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day, title, details }),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedData = await response.json();
        setItinerary(updatedData.itinerary); // Update state with new itinerary data
        window.location.reload();
      } else {
        console.error('Failed to add item:', response.status, response.statusText);
        alert(`Failed to add item: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item. Please try again later.');
    }
  };

  const addNewDay = async () => {
    try {
      const dayNumber = Object.keys(itinerary).length + 1;
  
      const response = await fetch(`http://localhost:3001/api/add-day/${itineraryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day: dayNumber }),
        credentials: 'include',
      });
  
      if (response.ok) {
        window.location.reload();
       } else {
        console.error('Failed to add new day:', response.status, response.statusText);
        alert(`Failed to add new day: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding new day:', error);
      alert('Error adding new day. Please try again later.');
    }
  };

  return (
    <div>
      <div className="edit-title">
        <h1
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setEditableTitle(e.target.innerText)}
        >
          {title}
        </h1>
        <h3
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setEditablePeriod(e.target.innerText)}
        >
          {period}
        </h3>
        <button onClick={saveTitleAndPeriod}>Save</button>
      </div>
  
      <button onClick={addNewDay}>+ Add Day</button>
  
      <div className="container">
        {/* Guarding against undefined or null itinerary */}
        {itinerary && Object.keys(itinerary).length > 0 ? (
          Object.keys(itinerary).map((dayKey, index) => (
            <div className="column" key={index}>
              <h2>Day {index + 1}</h2>
              {itinerary[dayKey].map((item) => (
                <div className="card" key={item.id}>
                  <h3
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => setEditableTitle(e.target.innerText)} // Set the title to editable state
                  >
                    {item.title}
                  </h3>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => setEditableDetails(e.target.innerText)} // Set the details to editable state
                  >
                    {item.details}
                  </p>
                  <button
                    onClick={() =>
                      handleSaveItineraryItem(item.id, index + 1, editableTitle, editableDetails)
                    }
                  >
                    Save
                  </button>
                </div>
              ))}
              <button onClick={() => addNewItem(index + 1)}>+ Add Item</button>
            </div>
          ))
        ) : (
          <p>No days added yet. Click the "+ Add Day" button to start!</p>
        )}
      </div>
    </div>
  );
};

export default EditItinerary;
