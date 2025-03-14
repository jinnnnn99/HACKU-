import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // 🔹 로그인 및 회원가입 핸들러 (isRegistering 상태에 따라 동작)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してください');
      return;
    }

    const endpoint = isRegistering ? "http://127.0.0.1:5003/register" : "http://127.0.0.1:5003/login";
    const payload = { username: email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === "error") {
        alert(result.message);
      } else {
        if (isRegistering) {
          alert("登録が完了しました！ログインしてください。");
          setIsRegistering(false); // 🔹 회원가입 후 로그인 화면으로 전환
        } else {
          alert("ログイン成功！");
          onLogin(result.user); // 🔹 로그인 상태 업데이트
          navigate('/'); // 🔹 홈 화면으로 이동
        }
      }
    } catch (error) {
      alert('処理中にエラーが発生しました。');
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        {isRegistering ? '新規アカウント登録' : 'ログイン'}
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            メールアドレス
          </label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ddd' 
            }} 
            required
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            パスワード
          </label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ddd' 
            }} 
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '12px 0',
            borderRadius: '4px',
            width: '100%',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          {isRegistering ? '登録する' : 'ログイン'}
        </button>
        
        <p style={{ textAlign: 'center', margin: '0' }}>
          {isRegistering 
            ? 'すでにアカウントをお持ちですか？ ' 
            : 'アカウントをお持ちでないですか？ '}
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              background: 'none',
              border: 'none',
              color: '#2196f3',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            {isRegistering ? 'ログイン' : '新規登録'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
