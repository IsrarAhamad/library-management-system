import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Maintenance from './pages/Maintenance';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Home from './pages/Home';
import { getCurrentUser } from './services/api';
import './App.css';

const RequireAuth = ({ role, children }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

function App() {
  // collapsed: true on mobile by default, false on desktop
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const user = getCurrentUser();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      {/* Sidebar */}
      {user && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      <div
        className={`flex flex-col min-h-screen bg-gray-50 transition-all duration-300
          ${user && !collapsed ? 'md:ml-56' : ''}`}
      >
        {user && <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />}
        <main className="p-4 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/maintenance" element={<RequireAuth role="admin"><Maintenance /></RequireAuth>} />
            <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
            <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
            <Route path="/users" element={<RequireAuth role="admin"><UserManagement /></RequireAuth>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


