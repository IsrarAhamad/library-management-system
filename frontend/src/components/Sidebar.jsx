import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../services/api';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Reports', to: '/reports' },
];
const adminItems = [
  { label: 'Maintenance', to: '/maintenance' },
  { label: 'User Management', to: '/users' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const user = getCurrentUser();
  const { pathname } = useLocation();
  let items = [...navItems];
  if (user?.role === 'admin') items = [ ...items, ...adminItems ];

  return (
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-30 md:hidden"
          onClick={() => setCollapsed(true)}
        ></div>
      )}
      <aside
        className={`
          fixed top-0 left-0 z-20 h-full shadow-xl bg-gradient-to-b from-blue-800 to-blue-500
          transition-transform duration-300 ease-in-out
          ${collapsed ? '-translate-x-full' : 'translate-x-0'}
          w-56 md:w-56 flex flex-col
        `}
      >
        <button
          className="my-4 ml-auto mr-2 text-2xl text-white"
          onClick={() => setCollapsed(true)}
          title="Close Sidebar"
          style={{ display: collapsed ? 'none' : 'block' }}
        >
          &#10005;
        </button>
        <nav className="mt-8 flex-1 space-y-3">
          {items.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition ${pathname === item.to ? 'bg-blue-900' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="h-10"></div>
      </aside>
    </>
  );
}


