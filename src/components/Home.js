import React, { useState, useEffect } from 'react';

function Home({ user, onJoinEvent }) {
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  // 🔹 サーバーから最新の活動データを取得する関数
  const fetchActivities = async () => {
    try {
      const response = await fetch('http://localhost:5003/activities');
      const data = await response.json();
      setActivities(data.activities); // 最新の活動リストをセット
    } catch (error) {
      console.error('アクティビティ取得エラー:', error);
    }
  };

  useEffect(() => {
    fetchActivities(); // 初回ロード時にアクティビティを取得
  }, []);

  const handleJoin = async (activity) => {
    if (user.points >= activity.cost) {
      onJoinEvent(activity.id, activity.cost);
      setMessage(`${activity.name}に参加しました！`);
      setShowMessage(true);

      try {
        // 🔹 ユーザー情報をサーバーで更新
        const response = await fetch('http://localhost:5003/use-points', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: user.username,
            cost: activity.cost
          })
        });

        const result = await response.json();

        if (result.status === 'success') {
          fetchActivities(); // 🔹 最新のデータを取得
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('ユーザー情報の更新に失敗しました:', error);
      }

      // 3초 후 메시지 숨기기
      setTimeout(() => setShowMessage(false), 3000);
    } else {
      alert("このアクティビティに参加するためのポイントが足りません。");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>
        利用可能なアクティビティ
      </h1>
      
      {showMessage && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          color: '#fff',
          backgroundColor: '#4caf50',
          borderRadius: '5px',
          transition: 'opacity 0.5s',
          opacity: showMessage ? 1 : 0
        }}>
          {message}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '10px'
      }}>
        {activities.length === 0 ? (
          <p>現在、利用可能なアクティビティはありません。</p>
        ) : (
          activities.map(activity => (
            <div key={activity.id} style={{ marginBottom: '15px' }}>
              <h2 style={{ margin: '0 0 10px 0' }}>{activity.name}</h2>
              <p>参加費: {activity.cost} ポイント</p>
              <p>場所: {activity.location}</p>
              <p>日付: {activity.date}</p>
              <p>説明: {activity.description}</p>
              {user.joinedActivities.includes(activity.id) ? (
                <button 
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#999',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'not-allowed'
                  }}
                  disabled
                >
                  参加済み
                </button>
              ) : (
                <button 
                  onClick={() => handleJoin(activity)} 
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#2965a8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  参加する
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
