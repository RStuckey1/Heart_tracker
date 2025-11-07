import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHeart as createHeartAPI } from '../api/HeartAPI.tsx';
import type { HeartData } from '../interfaces/HeartData.tsx';
import { useAuth } from '../context/AuthContext.tsx';

const NewHeartData = () => {
  const { User: loggedInUser, loading } = useAuth(); // Include loading state from AuthContext
  const navigate = useNavigate();

  const [newHeartData, setNewHeartData] = useState<HeartData | null>(null); // Initialize as null

  // Initialize the newHeartData state once loggedInUser is available
  useEffect(() => {
    if (!loading && loggedInUser) {
      setNewHeartData({
        id: 2,
        date: new Date(),
        time: new Date(),
        systolic: 0,
        diastolic: 0,
        pulse: 0,
        weight: 0,
        UserId: loggedInUser.id, // Assign the logged-in user's ID
      });
    }
  }, [loggedInUser, loading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newHeartData) return;
    try {
      const data = await createHeartAPI(newHeartData);
      console.log('Heart Data created:', data);
      navigate('/DisplayRecords', { state: { HeartId: data.id, initialMiles: data.miles } });
    } catch (err) {
      console.error('Failed to create New Data:', err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewHeartData((prev) => prev && ({
      ...prev,
      [name]: name === 'date' ? new Date(value) : name === 'time' ? new Date(`1970-01-01T${value}`) : name === 'systolic' || name === 'diastolic' || name === 'pulse' || name === 'weight' ? Number(value) : value,
    }));
  };

  if (loading || !newHeartData) {
    // Show a loading indicator or nothing while loading
    return <p>Loading...</p>;
  }

  return (
    <div className="container-newHeartData">
      <h2>Enter your Data</h2>
      <button onClick={() => navigate('/DisplayRecords')}>Back to your records</button>
      <form className="form-newHeartData" onSubmit={handleSubmit}>
        <label htmlFor="Date">Date</label>
        <input
          type="date"
          id="Date"
          name="date"
          value={newHeartData.date instanceof Date ? newHeartData.date.toISOString().split('T')[0] : ''}
          onChange={handleChange}
        />

        <label htmlFor="time">Time</label>
        <input
          type="time"
          id="time"
          name="time"
          value={newHeartData.time instanceof Date ? newHeartData.time.toTimeString().split(' ')[0].substring(0, 5) : ''}
          onChange={handleChange}
        />

        <label htmlFor="systolic">Systolic</label>
        <input
          type="text"
          id="systolic"
          name="systolic"
          value={newHeartData.systolic}
          onChange={handleChange}
        />

        <label htmlFor="diastolic">Diastolic</label>
        <input
          type="number"
          id="diastolic"
          name="diastolic"
          value={newHeartData.diastolic}
          onChange={handleChange}
        />

        <label htmlFor="pulse">Pulse</label>
        <input
          type="number"
          id="pulse"
          name="pulse"
          value={newHeartData.pulse}
          onChange={handleChange}
        />

        <label htmlFor="weight">Weight</label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={newHeartData.weight}
          onChange={handleChange}
        />

        <button className="newHeartDataButton" type="submit">Submit New Data</button>
      </form>
    </div>
  );
};

export default NewHeartData;
