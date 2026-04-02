// components/UserInfo.tsx
'use client';

import { useState, useEffect } from 'react';

export default function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Client-side code useEffect mein rakho
    const userData = localStorage.getItem('user');
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  // Show loading state initially
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {(user as any)?.name}!</h1>
    </div>
  );
}