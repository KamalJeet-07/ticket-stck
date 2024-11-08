import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useSupabase } from './hooks/useSupabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

export default function App() {
  const { user, login, logout } = useSupabase();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard onLogout={logout} /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}
