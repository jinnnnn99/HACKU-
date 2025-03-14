// src/components/PurchasePoints.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PurchasePoints({ onPurchase }) {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(10);
  
  const pointPackages = [
    { amount: 10, price: 3 },
    { amount: 50, price: 10 },
    { amount: 100, price: 15 }
  ];
  
  const handlePurchase = (e) => {
    e.preventDefault();
    
    // Call the onPurchase function if provided, otherwise show alert
    if (onPurchase) {
      onPurchase(selectedAmount);
      alert(`${selectedAmount}ポイントを購入しました！`);
      navigate('/profile');
    } else {
      alert(`実際のアプリでは${selectedAmount}ポイントを購入します。`);
      navigate('/profile');
    }
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>ポイント購入</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        {pointPackages.map(pkg => (
          <div 
            key={pkg.amount}
            style={{ 
              backgroundColor: selectedAmount === pkg.amount ? '#e8f5e9' : 'white',
              border: `2px solid ${selectedAmount === pkg.amount ? '#4caf50' : '#ddd'}`,
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedAmount(pkg.amount)}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>
              {pkg.amount} ポイント
            </div>
            <div style={{ fontSize: '1.5rem', color: '#4caf50', fontWeight: 'bold' }}>
              ${pkg.price}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handlePurchase} style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>支払い方法</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label>
            <input 
              type="radio" 
              checked={true} 
              readOnly
              style={{ marginRight: '10px' }}
            />
            クレジットカード
          </label>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="cardNumber" style={{ display: 'block', marginBottom: '5px' }}>
              カード番号
            </label>
            <input 
              type="text" 
              id="cardNumber" 
              placeholder="1234 5678 9012 3456" 
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid #ddd' 
              }} 
            />
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px' 
          }}>
            <div>
              <label htmlFor="expiry" style={{ display: 'block', marginBottom: '5px' }}>
                有効期限
              </label>
              <input 
                type="text" 
                id="expiry" 
                placeholder="MM/YY" 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd' 
                }} 
              />
            </div>
            
            <div>
              <label htmlFor="cvv" style={{ display: 'block', marginBottom: '5px' }}>
                セキュリティコード
              </label>
              <input 
                type="text" 
                id="cvv" 
                placeholder="123" 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd' 
                }} 
              />
            </div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '10px' 
          }}>
            <span>購入ポイント:</span>
            <span>{selectedAmount} ポイント</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontWeight: 'bold', 
            fontSize: '1.1rem' 
          }}>
            <span>価格:</span>
            <span>${pointPackages.find(pkg => pkg.amount === selectedAmount)?.price}</span>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between' 
        }}>
          <button 
            type="button" 
            onClick={() => navigate('/profile')}
            style={{
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            キャンセル
          </button>
          
          <button 
            type="submit"
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ポイントを購入
          </button>
        </div>
      </form>
    </div>
  );
}

export default PurchasePoints;