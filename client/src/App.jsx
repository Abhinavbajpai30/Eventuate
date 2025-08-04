import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Homepage from './components/Homepage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import DashboardLayout from './components/dashboard/DashboardLayout';
import OrganizerDashboard from './components/dashboard/OrganizerDashboard';
import CreateEvent from './components/dashboard/CreateEvent';
import AttendeeDashboard from './components/dashboard/AttendeeDashboard';
import MyBookings from './components/dashboard/MyBookings';
import ManageBookings from './components/dashboard/ManageBookings';
import QRScanner from './components/dashboard/QRScanner';
import Settings from './components/dashboard/Settings';
import About from './components/About';
import Contact from './components/Contact';
import './App.css';

// Component to determine which dashboard to show based on user role
const DashboardRouter = () => {
  const { user } = useAuth();
  
  // If user is organizer or has 'both' account type, show organizer dashboard
  if (user?.accountType === 'organizer' || user?.accountType === 'both') {
    return <OrganizerDashboard />;
  }
  
  // Default to attendee dashboard
  return <AttendeeDashboard />;
};

// Component to determine which bookings page to show based on user role
const BookingsRouter = () => {
  const { user } = useAuth();
  
  // If user is organizer or has 'both' account type, show manage bookings
  if (user?.accountType === 'organizer' || user?.accountType === 'both') {
    return <ManageBookings />;
  }
  
  // Default to attendee bookings
  return <MyBookings />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          
          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="dashboard">
                  <DashboardRouter />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/events"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="events">
                  <OrganizerDashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/events/create"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="events">
                  <CreateEvent />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/discover"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="discover">
                  <AttendeeDashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/bookings"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="bookings">
                  <BookingsRouter />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/qr-scanner"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="qr-scanner">
                  <QRScanner />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/settings"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="settings">
                  <Settings />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
