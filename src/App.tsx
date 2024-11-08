import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useSupabase } from './hooks/useSupabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const { user, loading } = useSupabase();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient flex items-center justify-center">
        <div className="glass-morphism p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {user ? <Dashboard /> : <Login />}
    </>
  );
}