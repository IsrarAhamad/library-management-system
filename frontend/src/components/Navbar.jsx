import React from 'react';
import { getCurrentUser, logout } from '../services/api';

export default function Navbar({ collapsed, setCollapsed }) {
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const showHamburger = typeof setCollapsed === 'function';

  return (
    <nav className="bg-white px-4 py-2 shadow flex justify-between items-center">
      <div className="flex items-center gap-3">
        {showHamburger && collapsed && (
          <button
            className="text-2xl text-blue-800"
            onClick={() => setCollapsed(false)}
            aria-label="Toggle sidebar"
          >
            &#9776;
          </button>
        )}
        <div className="text-lg font-bold text-blue-600 pl-1">Library Management</div>
      </div>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-gray-700">{user.role} | {user.name}</span>}
        <button onClick={handleLogout} className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600">Logout</button>
      </div>
    </nav>
  );
}