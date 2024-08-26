import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [itineraryTitle, setItineraryTitle] = useState('');
    const [itineraryPeriod, setItineraryPeriod] = useState('');
    const [itinerary, setItinerary] = useState({});
    const [showSaveTitlePeriodButton, setShowSaveTitlePeriodButton] = useState(false);

    // Fetch initial data
    useEffect(() => {
        fetch('/get-itinerary')
            .then(response => response.json())
            .then(data => {
                setItineraryTitle(data.title);
                setItineraryPeriod(data.period);
                setItinerary(data.itinerary);
            })
            .catch(error => console.error('Error fetching itinerary:', error));
    }, []);

    const handleTitlePeriodChange = () => {
        setShowSaveTitlePeriodButton(true);
    };

    const saveTitlePeriod = () => {
        fetch('/save-title-period', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: itineraryTitle, period: itineraryPeriod })
        })
        .then(response => {
            if (response.ok) {
                alert('Title and period saved successfully');
                setShowSaveTitlePeriodButton(false);
            } else {
                alert('Error saving title and period');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving title and period');
        });
    };

    const saveItineraryItem = (day, id, title, details) => {
        fetch('/save-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, title, details })
        })
        .then(response => {
            if (response.ok) {
                alert('Itinerary saved successfully');
            } else {
                alert('Error saving itinerary');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving itinerary');
        });
    };

    const addItineraryItem = (day) => {
        const title = prompt('Enter title:');
        const details = prompt('Enter details:');

        fetch('/add-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ day, title, details })
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error adding itinerary item');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding itinerary item');
        });
    };

    const addDay = () => {
        const dayNumber = Object.keys(itinerary).length + 1;

        fetch('/add-day', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ day: dayNumber })
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error adding day');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding day');
        });
    };

    return (
        <div>
            <div className="edit-title">
                <h1 contentEditable onInput={handleTitlePeriodChange}>{itineraryTitle}</h1>
                <h3 contentEditable onInput={handleTitlePeriodChange}>{itineraryPeriod}</h3>
                {showSaveTitlePeriodButton && (
                    <button onClick={saveTitlePeriod} className="save-button">Save</button>
                )}
            </div>
            <button id="add-day-button" onClick={addDay}>+ Add Day</button>
            <div className="container" id="itinerary-container">
                {Object.keys(itinerary).map((dayKey, index) => (
                    <div className="column" key={index}>
                        <h2>Day {index + 1}</h2>
                        {itinerary[dayKey].map(item => (
                            <div className="card" key={item.id}>
                                <h3 contentEditable onBlur={(e) => saveItineraryItem(index + 1, item.id, e.target.innerText, item.details)}>{item.title}</h3>
                                <p contentEditable onBlur={(e) => saveItineraryItem(index + 1, item.id, item.title, e.target.innerText)}>{item.details}</p>
                                <button onClick={() => saveItineraryItem(index + 1, item.id, item.title, item.details)} className="save-button">Save</button>
                            </div>
                        ))}
                        <button onClick={() => addItineraryItem(index + 1)} className="add-button">+</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
