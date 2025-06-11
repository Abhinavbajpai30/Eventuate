import React from 'react';
import './App.css'
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateEventForm from './components/CreateEventForm';
import EventList from './components/EventList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  if (!token) {
    toast.info('Please log in to access the dashboard.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/profile" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={
          <AuthRoute>
            <Login/>
          </AuthRoute>
        }/>
        <Route path="/signup" element={
          <AuthRoute>
            <SignUp/>
          </AuthRoute>
        }/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }/>
        <Route path="/events" element={
          <ProtectedRoute>
            <EventList/>
          </ProtectedRoute>
        }/>
        <Route path="/create-event" element={
          <ProtectedRoute>
            <CreateEventForm/>
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  )
}

export default App
