/**
 * ⚠️ FILE DEBUG TẠM THỜI - Để kiểm tra localStorage
 * Mở file này trong browser để xem dữ liệu
 */

import React from 'react';

export const LocalStorageDebug = () => {
  const getStorageInfo = () => {
    return {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      userId: localStorage.getItem('userId'),
      allKeys: Object.keys(localStorage)
    };
  };

  const storageInfo = getStorageInfo();

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', margin: '20px' }}>
      <h3>🔍 LocalStorage Debug Info</h3>
      <pre style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
        {JSON.stringify(storageInfo, null, 2)}
      </pre>
      
      <h4>📝 Chi tiết:</h4>
      <ul>
        <li><strong>Token:</strong> {storageInfo.token ? '✅ Có' : '❌ Không'}</li>
        <li><strong>Username:</strong> {storageInfo.username || '❌ Không'}</li>
        <li><strong>UserId:</strong> {storageInfo.userId || '❌ Không'}</li>
        <li><strong>Tất cả keys:</strong> {storageInfo.allKeys.join(', ')}</li>
      </ul>

      <h4>🔧 Cách fix:</h4>
      <ul>
        <li>1. Nếu userId = "❌ Không" → Backend chưa trả userId khi login/register</li>
        <li>2. Nếu token = "❌ Không" → Chưa đăng nhập</li>
        <li>3. Kiểm tra network tab (F12 → Network) xem response từ backend</li>
      </ul>
    </div>
  );
};

export default LocalStorageDebug;
