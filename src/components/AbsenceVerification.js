// src/components/AbsenceVerification.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AbsenceVerification({ user }) {
  const [reason, setReason] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check which route is being accessed
  const isAttendanceVerification = location.pathname === '/verify-attendance';
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if ((!isAttendanceVerification && !reason) || !selectedFile) {
      alert(isAttendanceVerification ? '写真を提供してください' : '理由と写真の両方を提供してください');
      return;
    }
    
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('username', user.username);
    if (!isAttendanceVerification) {
      formData.append('reason', reason);
    }
    formData.append('photo', selectedFile);
    
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
        alert('写真のアップロードに失敗しました');
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
        
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            {isAttendanceVerification ? '出席証明写真' : '証明写真'}のアップロード
          </label>
          <div style={{ 
            border: '2px dashed #ddd', 
            borderRadius: '4px', 
            padding: '20px',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: '#666', 
              marginBottom: '15px',
              fontStyle: 'italic'
            }}>
              特別なポーズ（両手を頭の上に置く）で撮影した写真をアップロードしてください。
              <br />
              これは{isAttendanceVerification ? '出席確認' : '欠席証明'}のために必要です。
            </p>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="photo-upload"
              required
            />
            <label htmlFor="photo-upload" style={{
              display: 'inline-block',
              backgroundColor: '#f5f5f5',
              color: '#333',
              padding: '10px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              border: '1px solid #ddd'
            }}>
              写真を選択
            </label>
            
            {filePreview && (
              <div style={{ marginTop: '15px' }}>
                <img 
                  src={filePreview} 
                  alt="アップロード写真プレビュー" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px',
                    borderRadius: '4px'
                  }} 
                />
              </div>
            )}
          </div>
        </div>
        
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