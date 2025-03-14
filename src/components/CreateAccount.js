import React, { useState } from 'react';

function CreateAccount({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:5003/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('アカウントが作成されました！');
        onRegister(data.user);
      } else {
        alert(data.message);
      }
    })
    .catch(error => console.error('Error registering user:', error));
  };

  return (
    <div>
      <h2>アカウント作成</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="ユーザー名" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="パスワード" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">作成する</button>
      </form>
    </div>
  );
}

export default CreateAccount;
