import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHeart as createHeartAPI } from '../api/HeartAPI.tsx';
import type { HeartData } from '../interfaces/HeartData.tsx';
import { useAuth } from '../context/AuthContext.tsx';

const NewHeartData = () => {
  const { User: loggedInUser, loading } = useAuth();
  const navigate = useNavigate();

  const [newHeartData, setNewHeartData] = useState<HeartData | null>(null);

  // Initialize the newHeartData state once loggedInUser is available
  useEffect(() => {
    if (!loading && loggedInUser) {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0].substring(0, 5);
      setNewHeartData({
        date: new Date(),
        time: timeString,
        systolic: 0,
        diastolic: 0,
        pulse: 0,
        weight: 0,
        UserId: loggedInUser.id,
      });
    }
  }, [loggedInUser, loading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newHeartData) {
      console.error('No heart data to submit');
      return;
    }
    
    // Convert time string to Date object
    const timeString = typeof newHeartData.time === 'string' ? newHeartData.time : newHeartData.time.toTimeString().split(' ')[0].substring(0, 5);
    const [hours, minutes] = timeString.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const dataToSubmit = {
      ...newHeartData,
      time: timeDate
    };
    
    console.log('Submitting heart data:', JSON.stringify(dataToSubmit, null, 2));
    try {
      const data = await createHeartAPI(dataToSubmit);
      console.log('Heart Data created successfully:', data);
      console.log('Navigating to /DisplayRecords');
      navigate('/DisplayRecords');
      console.log('Navigation called');
    } catch (err) {
      console.error('Failed to create New Data:', err);
      alert(`Failed to create heart data: ${err}`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewHeartData((prev) => {
      if (!prev) return prev;
      
      if (name === 'date') {
        return { ...prev, date: new Date(value) };
      } else if (name === 'time') {
        return { ...prev, time: value };
      } else if (name === 'systolic' || name === 'diastolic' || name === 'pulse' || name === 'weight') {
        return { ...prev, [name]: Number(value) };
      }
      
      return { ...prev, [name]: value };
    });
  };

  if (loading || !newHeartData) {
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
          value={typeof newHeartData.time === 'string' ? newHeartData.time : ''}
          onChange={handleChange}
        />

        <label htmlFor="systolic">Systolic</label>
        <input
          type="number"
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
