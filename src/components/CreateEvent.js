// src/components/CreateEvent.js
import React, { useState } from 'react';

function CreateEvent({ onEventCreated }) {
  const [eventName, setEventName] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!eventName || !cost || !date || !time || !location || !description) {
      setMessage('すべての項目を入力してください。');
      return;
    }

    const newEvent = {
      name: eventName,
      cost: parseInt(cost, 10),
      date,
      time,
      location,
      description
    };

    fetch('http://localhost:5003/create-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'Event created') {
        setMessage('アクティビティが作成されました！');
        onEventCreated(newEvent);
        setEventName('');
        setCost('');
        setDate('');
        setTime('');
        setLocation('');
        setDescription('');
      } else {
        setMessage('アクティビティ作成に失敗しました。');
      }
    })
    .catch(error => {
      console.error('Failed to create event:', error);
      setMessage('サーバーとの通信に失敗しました。');
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>アクティビティ作成</h1>

      {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}

      <input 
        type="text" 
        placeholder="アクティビティ名" 
        value={eventName} 
        onChange={(e) => setEventName(e.target.value)} 
        required 
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input 
        type="number" 
        placeholder="ポイント" 
        value={cost} 
        onChange={(e) => setCost(e.target.value)} 
        required 
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        required 
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input 
        type="time" 
        value={time} 
        onChange={(e) => setTime(e.target.value)} 
        required 
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input 
        type="text" 
        placeholder="場所" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
        required 
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <textarea
        placeholder="アクティビティの説明を入力してください"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px', height: '100px' }}
      />

      <button 
        onClick={handleSubmit} 
        style={{
          padding: '10px 20px',
          backgroundColor: '#2965a8',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        作成する
      </button>
    </div>
  );
}

export default CreateEvent;
