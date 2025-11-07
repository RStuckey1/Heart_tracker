import React from 'react';
import { deleteHeart } from '../api/HeartAPI';
import '../CSS/DisplayRecords.css';

type HeartData = {
  id: number;
  date: Date;
  time: Date;
  systolic: number;
  diastolic: number;
  pulse: number;
  weight: number;
  UserId: number | null; // foreign key to User
};

const DisplayRecords: React.FC = () => {
  const [heartDataList, setHeartDataList] = React.useState<HeartData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
  const fetchHeartData = async () => {
    try {
    // You'll need to implement getUserHeartData in your api service
    const response = await fetch('/api/heart-data'); // Adjust endpoint as needed
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
      {heartDataList.map((record) => (
      <tr key={record.id}>
        <td>{new Date(record.date).toLocaleDateString()}</td>
        <td>{new Date(record.time).toLocaleTimeString()}</td>
        <td>{record.systolic}</td>
        <td>{record.diastolic}</td>
        <td>{record.pulse}</td>
        <td>{record.weight}</td>
        <td>
        <button onClick={() => handleDelete(record.id)}>Delete</button>
        </td>
      </tr>
      ))}
    </tbody>
    </table>
  </div>
  );
};


export default DisplayRecords;
