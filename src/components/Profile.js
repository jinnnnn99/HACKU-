// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function Profile({ user, onAddPoints }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 서버에서 사용자의 코멘트를 불러옴
    fetch(`http://localhost:5003/comments?username=${user.username}`)
      .then(response => response.json())
      .then(data => setComments(data.comments))
      .catch(error => console.error('Failed to fetch comments:', error));
  }, [user.username]);

  // QR 코드 스캔 시 15포인트 추가
  const handleScanQRCode = () => {
    fetch('http://localhost:5003/add-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        onAddPoints(15); // 클라이언트 측 포인트 업데이트
        setMessage('15ポイントが追加されました！');
      } else {
        setMessage('ポイント追加に失敗しました。');
      }
      setTimeout(() => setMessage(''), 3000);
    })
    .catch(error => {
      console.error('Failed to update points:', error);
      setMessage('サーバーとの通信に失敗しました。');
    });
  };

  // 코멘트 추가 처리
  const handleAddComment = () => {
    if (newComment.trim()) {
      fetch('http://localhost:5003/add-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          comment: newComment
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setComments([...comments, { username: user.username, comment: newComment }]);
          setNewComment('');
          setMessage('コメントが追加されました！');
        } else {
          setMessage('コメント追加に失敗しました。');
        }
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(error => {
        console.error('Failed to add comment:', error);
        setMessage('コメント追加中にエラーが発生しました。');
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{user.username} のプロフィール</h1>
      <p>ポイント: {user.points} ポイント</p>

      {message && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          color: '#fff',
          backgroundColor: '#4caf50',
          borderRadius: '5px',
        }}>
          {message}
        </div>
      )}

      <h2>あなたのQRコード</h2>
      <QRCodeCanvas 
        value={`http://example.com/user/${user.username}`} 
        size={128} 
        bgColor="#ffffff" 
        fgColor="#000000" 
        level="Q" 
      />

      <button onClick={handleScanQRCode} style={{
        display: 'block',
        margin: '20px auto',
        padding: '10px 20px',
        backgroundColor: '#2965a8',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        QRコードをスキャンする
      </button>

      <h2>コメントを追加する</h2>
      <textarea 
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="コメントを入力してください"
        style={{ width: '100%', height: '100px', marginBottom: '10px' }}
      />
      <button onClick={handleAddComment} style={{
        padding: '10px 15px',
        backgroundColor: '#2965a8',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        コメントを追加
      </button>

      <h2>コメント一覧</h2>
      <ul>
        {comments.map((comment, index) => (
          <li key={index} style={{
            backgroundColor: '#f9f9f9',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            margin: '5px 0'
          }}>
            <strong>{comment.username}:</strong> {comment.comment}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
