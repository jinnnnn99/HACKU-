// src/components/AttendanceVerification.js
import React, { useState, useEffect } from 'react';

function AttendanceVerification({ user, onAddPoints }) {
  const [scannedUserId, setScannedUserId] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch activities from the backend
  useEffect(() => {
    fetch('http://localhost:5003/activities')
      .then(response => response.json())
      .then(data => {
        if (data.activities) {
          setActivities(data.activities);
        }
      })
      .catch(error => console.error('Failed to fetch activities:', error));
  }, []);

  // Handle attendance verification
  const handleVerifyAttendance = () => {
    if (!scannedUserId) {
      alert('ユーザーIDを入力してください。');
      return;
    }
    if (!selectedActivity) {
      alert('アクティビティを選択してください。');
      return;
    }

    setLoading(true);

    fetch('http://localhost:5003/attendance-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: scannedUserId, activityId: selectedActivity })
    })
    .then(response => response.json())
    .then(data => {
      setMessage(`出席確認: ${data.status}`);
      setTimeout(() => setMessage(''), 3000);
    })
    .catch(error => {
      console.error('Error verifying attendance:', error);
      setMessage('出席確認に失敗しました。');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('有効な画像ファイルを選択してください。');
      setSelectedFile(null);
    }
  };

  // Handle photo upload and point award
  const handleUploadPhoto = () => {
    if (!selectedFile) {
      alert('写真を選択してください。');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('username', user?.username || '');

    fetch('http://localhost:5003/upload-photo', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        setMessage(data.message);
        if (onAddPoints) onAddPoints(10);
        setSelectedFile(null);
      } else {
        setMessage(data.message);
      }
    })
    .catch(error => {
      console.error('Failed to upload photo:', error);
      setMessage('写真のアップロードに失敗しました。もう一度試してください。');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>出席確認</h1>
      <p>ポイント: {user?.points || 0} ポイント</p>

      {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}

      <h2>アクティビティ出席確認</h2>
      <input 
        type="text" 
        placeholder="ユーザーIDをスキャン" 
        value={scannedUserId} 
        onChange={(e) => setScannedUserId(e.target.value)} 
        required 
        style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
      />
      
      <select 
        value={selectedActivity}
        onChange={(e) => setSelectedActivity(e.target.value)} 
        required 
        style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
      >
        <option value="">アクティビティを選択</option>
        {activities.map(activity => (
          <option key={activity.id} value={activity.id}>
            {activity.name}
          </option>
        ))}
      </select>
      
      <button 
        onClick={handleVerifyAttendance} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#cccccc' : '#2965a8',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? '処理中...' : '出席を確認する'}
      </button>

      <h2>証拠写真をアップロードする</h2>
      <p style={{ marginBottom: '10px', fontStyle: 'italic', color: '#666' }}>
        特別なポーズ（両手を頭の上に置く）で撮影した写真をアップロードしてください。
      </p>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        style={{ marginBottom: '10px' }} 
      />
      
      <button 
        onClick={handleUploadPhoto} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#cccccc' : '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '処理中...' : '写真をアップロードして10ポイントを取得'}
      </button>
    </div>
  );
}

export default AttendanceVerification;