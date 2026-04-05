import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues';
import AdminDashboard from './pages/AdminDashboard';
import IssueDetail from './pages/IssueDetail';

function PrivateRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container py-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/report" element={
              <PrivateRoute><ReportIssue /></PrivateRoute>
            } />
            <Route path="/my-issues" element={
              <PrivateRoute><MyIssues /></PrivateRoute>
            } />
            <Route path="/issue/:id" element={
              <PrivateRoute><IssueDetail /></PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
