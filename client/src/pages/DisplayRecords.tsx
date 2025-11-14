import React from 'react';
import { deleteHeart, updateHeart } from '../api/HeartAPI';
import Auth from '../utils/auth';
import '../CSS/DisplayRecords.css';

type HeartData = {
  id: number;
  date: string | Date;
  time: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  weight: number;
  UserId: number | null; // foreign key to User
};

const DisplayRecords: React.FC = () => {
  const [heartDataList, setHeartDataList] = React.useState<HeartData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editFormData, setEditFormData] = React.useState<HeartData | null>(null);

  React.useEffect(() => {
  const fetchHeartData = async () => {
    try {
    const response = await fetch('/api/heart/', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setHeartDataList(data);
    } catch (error) {
    console.error('Error fetching heart data:', error);
    } finally {
    setLoading(false);
    }
  };

  fetchHeartData();
  }, []);

  const handleDelete = async (id: number) => {
  if (window.confirm('Are you sure you want to delete this record?')) {
    await deleteHeart(id);
    setHeartDataList(heartDataList.filter(item => item.id !== id));
  }
  };

  const handleEdit = (record: HeartData) => {
    setEditingId(record.id);
    setEditFormData({ ...record });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof HeartData) => {
    if (!editFormData) return;
    const value = e.target.value;
    
    if (field === 'date') {
      setEditFormData({ ...editFormData, date: value });
    } else if (field === 'time') {
      setEditFormData({ ...editFormData, time: value });
    } else if (field === 'systolic' || field === 'diastolic' || field === 'pulse' || field === 'weight') {
      setEditFormData({ ...editFormData, [field]: Number(value) });
    }
  };

  const handleSaveEdit = async () => {
    if (!editFormData || !editingId) return;
    try {
      const dataToSave = {
        ...editFormData,
        date: typeof editFormData.date === 'string' ? new Date(editFormData.date) : editFormData.date
      };
      await updateHeart(editingId, dataToSave as any);
      setHeartDataList(heartDataList.map(item => 
        item.id === editingId ? editFormData : item
      ));
      setEditingId(null);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating heart data:', error);
      alert('Failed to update record');
    }
  };

  if (loading) {
  return <div className='display-records'>Loading...</div>;
  }

  return (
  <div className='display-records'>
    <h2>Heart Data Records</h2>
    <table>
    <thead>
      <tr>
      <th>Date</th>
      <th>Time</th>
      <th>Systolic</th>
      <th>Diastolic</th>
      <th>Pulse</th>
      <th>Weight</th>
      <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {heartDataList.map((record) => {
        const isEditing = editingId === record.id;
        const recordDate = new Date(record.date);
        const timeDisplay = record.time.substring(0, 5);
        
        if (isEditing && editFormData) {
          return (
            <tr key={record.id}>
              <td><input type="date" value={typeof editFormData.date === 'string' ? editFormData.date : new Date(editFormData.date).toISOString().split('T')[0]} onChange={(e) => handleEditChange(e, 'date')} /></td>
              <td><input type="time" value={editFormData.time.substring(0, 5)} onChange={(e) => handleEditChange(e, 'time')} /></td>
              <td><input type="number" value={editFormData.systolic} onChange={(e) => handleEditChange(e, 'systolic')} /></td>
              <td><input type="number" value={editFormData.diastolic} onChange={(e) => handleEditChange(e, 'diastolic')} /></td>
              <td><input type="number" value={editFormData.pulse} onChange={(e) => handleEditChange(e, 'pulse')} /></td>
              <td><input type="number" step="0.1" value={editFormData.weight} onChange={(e) => handleEditChange(e, 'weight')} /></td>
              <td>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </td>
            </tr>
          );
        }
        
        return (
        <tr key={record.id}>
          <td>{recordDate.toLocaleDateString()}</td>
          <td>{timeDisplay}</td>
          <td>{record.systolic}</td>
          <td>{record.diastolic}</td>
          <td>{record.pulse}</td>
          <td>{record.weight}</td>
          <td>
          <button onClick={() => handleEdit(record)}>Edit</button>
          <button onClick={() => handleDelete(record.id)}>Delete</button>
          </td>
        </tr>
        );
      })}
    </tbody>
    </table>
  </div>
  );
};


export default DisplayRecords;
