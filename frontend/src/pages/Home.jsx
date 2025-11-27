import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-900 shadow-lg">Library Management System</h1>
      <div className="space-x-6">
        <button className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg text-lg hover:bg-blue-600 font-semibold" onClick={() => nav('/login', { state: { mode: 'login' } })}>
          Sign In
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg hover:bg-green-500 font-semibold" onClick={() => nav('/login', { state: { mode: 'signup' } })}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
