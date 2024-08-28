import React, { useEffect, useState } from 'react';
import './checklistItemsStyles.css';

const ChecklistPage = () => {
  const [checklistItems, setChecklistItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const fetchChecklistFromServer = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/get-checklist-items', {
          method: 'GET',
          credentials: 'include',
        });
  
        if (response.ok) {
          const data = await response.json();
          setChecklistItems(data.checklistItems || []);
        } else {
          console.error('Failed to fetch checklist items:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching checklist items:', error);
      }
    };
  
    fetchChecklistFromServer();
  }, []);
  
  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/add-checklist-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: newItem }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Item added to checklist') {
          setChecklistItems(prevItems => [...prevItems, { item: newItem, is_checked: false }]);
          setNewItem('');
        }
      } else {
        console.error('Failed to add item:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding checklist item:', error);
    }
  };

  const handleDeleteItem = async (itemToDelete) => {
    try {
      const response = await fetch('http://localhost:3001/api/delete-checklist-item', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: itemToDelete }),
        credentials: 'include',
      });

      if (response.ok) {
        setChecklistItems(prevItems => prevItems.filter(item => item.item !== itemToDelete));
      } else {
        console.error('Failed to delete item:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting checklist item:', error);
    }
  };

  const handleCheckboxChange = async (itemToCheck) => {
    try {
      const response = await fetch('http://localhost:3001/api/update-checklist-item', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: itemToCheck.item, is_checked: !itemToCheck.is_checked }),
        credentials: 'include',
      });

      if (response.ok) {
        setChecklistItems(prevItems =>
          prevItems.map(item =>
            item.item === itemToCheck.item ? { ...item, is_checked: !item.is_checked } : item
          )
        );
      } else {
        console.error('Failed to update item:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  return (
    <div>
      <h1>Checklist</h1>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          name="item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          required
        />
        <button type="submit" className='list-button'>Add Item</button>
      </form>
      <ul className="grid-container" >
        {checklistItems.map((item, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={item.is_checked}
              onChange={() => handleCheckboxChange(item)}
            />
            {item.item}
            <button className= 'list-button'onClick={() => handleDeleteItem(item.item)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChecklistPage;
