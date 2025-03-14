// src/components/AbsenceVerification.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AbsenceVerification({ user }) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check which route is being accessed
  const isAttendanceVerification = location.pathname === '/verify-attendance';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAttendanceVerification && !reason) {
      alert('理由を入力してください');
      return;
    }
    
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('username', user.username);
    if (!isAttendanceVerification) {
      formData.append('reason', reason);
    }
    
    fetch('http://localhost:5003/upload-photo', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert(data.message || (isAttendanceVerification ? 
            '出席が確認されました。ポイントを獲得しました！' : 
            '欠席が証明されました。ポイントが返金されました！'));
          navigate('/profile');
        } else {
          alert(data.message || 'エラーが発生しました');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('送信に失敗しました');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>
        {isAttendanceVerification ? '出席確認' : '欠席証明'}
      </h1>
      
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        {!isAttendanceVerification && (
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="reason" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              欠席の理由
            </label>
            <textarea 
              id="reason" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="欠席の理由を入力してください"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                minHeight: '100px',
                resize: 'vertical'
              }} 
              required
            />
          </div>
        )}
        
        {isAttendanceVerification && (
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <p style={{ 
              color: '#666', 
              marginBottom: '15px',
              fontStyle: 'italic'
            }}>
              出席を確認するためのボタンを押してください。
            </p>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#cccccc' : '#4caf50',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '4px',
            width: '100%',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}
        >
          {isLoading ? '処理中...' : '提出する'}
        </button>
      </form>
    </div>
  );
}

export default AbsenceVerification;