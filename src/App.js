import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import LeadManagement from './components/LeadManagement';
import ClientManagement from './components/ClientManagement';
import ProjectManagement from './components/ProjectManagement';
import Reports from './components/Reports';
import { ClientsProvider } from './contexts/ClientsContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ClientsProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/users" element={user ? <UserManagement user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/leads" element={(user?.role === 'Admin' || user?.role === 'Staff') ? <LeadManagement user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="/clients" element={(user?.role === 'Admin' || user?.role === 'Staff') ? <ClientManagement user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="/projects" element={(user?.role === 'Admin' || user?.role === 'Staff') ? <ProjectManagement user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="/reports" element={(user?.role === 'Admin' || user?.role === 'Staff') ? <Reports user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ClientsProvider>
  );
}

export default App;
