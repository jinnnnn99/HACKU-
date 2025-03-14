import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import CreateEvent from './components/CreateEvent';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Login from './components/login';
import CreateAccount from './components/CreateAccount';
import AttendanceVerification from './components/AttendanceVerification';

function App() {
  const [user, setUser] = useState(null); // 로그인 초기 상태를 null로 설정
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // 초기 활동 데이터를 서버에서 불러옴 (Flask API 호출)
    fetch('http://localhost:5003/activities')
      .then(response => response.json())
      .then(data => setActivities(data.activities))
      .catch(error => console.error('Failed to fetch activities:', error));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleJoinEvent = (eventId, cost) => {
    if (!user) return;

    const updatedPoints = user.points - cost;
    const updatedActivities = [...user.joinedActivities, eventId];

    setUser(prev => ({
      ...prev,
      points: updatedPoints,
      joinedActivities: updatedActivities
    }));

    // 📌 서버에 포인트 차감 및 참여한 활동 저장 요청
    fetch('http://localhost:5003/use-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user.username,
        cost: cost
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        console.log('ポイント更新完了:', data);
      } else {
        console.error('ポイント更新失敗:', data.message);
      }
    })
    .catch(error => console.error('Failed to update user data:', error));
  };

  const handleCreateEvent = (newEvent) => {
    setActivities(prev => [...prev, newEvent]);

    // 📌 Flask API에 새로운 이벤트 저장 요청
    fetch('http://localhost:5003/create-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEvent)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'Event created') {
        console.log('イベント作成成功:', data);
      } else {
        console.error('イベント作成失敗:', data.message);
      }
    })
    .catch(error => console.error('Failed to create event:', error));
  };

  return (
    <div>
      {user && <Navbar userPoints={user.points} onLogout={handleLogout} />}
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* 초기 화면에서 항상 로그인 화면으로 이동 */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 로그인 페이지 */}
          <Route path="/login" element={
            user ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />
          } />

          {/* 회원가입 페이지 */}
          <Route path="/create-account" element={
            user ? <Navigate to="/home" replace /> : <CreateAccount onRegister={handleLogin} />
          } />

          {/* 보호된 페이지 - 로그인 상태에서만 접근 가능 */}
          <Route path="/home" element={
            user ? <Home user={user} activities={activities} onJoinEvent={handleJoinEvent} />
            : <Navigate to="/login" replace />
          } />
          
          <Route path="/create" element={
            user ? <CreateEvent onEventCreated={handleCreateEvent} />
            : <Navigate to="/login" replace />
          } />
          
          <Route path="/profile" element={
            user ? <Profile user={user} />
            : <Navigate to="/login" replace />
          } />
          
          <Route path="/verify-attendance" element={  
            user ? <AttendanceVerification user={user} onAddPoints={(points) => {
              setUser(prev => ({ ...prev, points: prev.points + points }));
               }} />
              : <Navigate to="/login" replace />
          } />

          {/* 잘못된 경로 접근 시 로그인 화면으로 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
