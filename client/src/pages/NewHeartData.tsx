import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHeart as createHeartAPI } from '../api/HeartAPI.tsx';
import type { HeartData } from '../interfaces/HeartData.tsx';
import { useAuth } from '../context/useAuth';
import "../CSS/NewHeartData.css"

const formatLocalDate = (date: Date): string => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().split('T')[0];
};

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
    
    console.log('Submitting heart data:', JSON.stringify(newHeartData, null, 2));
    try {
      const data = await createHeartAPI(newHeartData);
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
        return { ...prev, date: new Date(`${value}T00:00:00`) };
      } else if (name === 'time') {
        return { ...prev, time: value };
      } else if (name === 'systolic' || name === 'diastolic' || name === 'pulse' || name === 'weight') {
        return { ...prev, [name]: Number(value) };
      }
      
      return { ...prev, [name]: value };
    });
  };

  if (loading || !newHeartData) {
    return <p className="loading-message" role="status">Preparing your entry…</p>;
  }

  return (
    <section className="reading-form-page">
      <p className="eyebrow">Daily health journal</p>
      <h1 className="page-title">Add a reading</h1>
      <p className="page-description">Enter the measurements you want to keep with your records. You can update or remove an entry later.</p>
      <div className="reading-form-card card">
        <p className="reading-form-note">Date, time, blood pressure, and pulse are required. Weight is optional.</p>
        <form className="reading-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              className="form-input"
              type="date"
              id="date"
              name="date"
              required
              value={newHeartData.date instanceof Date ? formatLocalDate(newHeartData.date) : ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              className="form-input"
              type="time"
              id="time"
              name="time"
              required
              value={typeof newHeartData.time === 'string' ? newHeartData.time : ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="systolic">Systolic <span>(mmHg)</span></label>
            <input
              className="form-input"
              type="number"
              id="systolic"
              name="systolic"
              min="1"
              required
              value={newHeartData.systolic || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="diastolic">Diastolic <span>(mmHg)</span></label>
            <input
              className="form-input"
              type="number"
              id="diastolic"
              name="diastolic"
              min="1"
              required
              value={newHeartData.diastolic || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pulse">Pulse <span>(bpm)</span></label>
            <input
              className="form-input"
              type="number"
              id="pulse"
              name="pulse"
              min="1"
              required
              value={newHeartData.pulse || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight <span>(optional)</span></label>
            <input
              className="form-input"
              type="number"
              id="weight"
              name="weight"
              min="0"
              step="0.1"
              value={newHeartData.weight || ''}
              onChange={handleChange}
            />
          </div>
          <div className="reading-form-actions">
            <button className="button button-secondary" type="button" onClick={() => navigate('/DisplayRecords')}>
              Back to my readings
            </button>
            <button className="button" type="submit">Save reading</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewHeartData;
