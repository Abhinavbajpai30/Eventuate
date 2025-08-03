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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
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
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h2>
                    <p className="text-gray-600">Booking management coming soon...</p>
                  </div>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="analytics">
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
                    <p className="text-gray-600">Analytics dashboard coming soon...</p>
                  </div>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/insights"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="insights">
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Insights</h2>
                    <p className="text-gray-600">Personal insights coming soon...</p>
                  </div>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <PrivateRoute>
                <DashboardLayout currentView="settings">
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                    <p className="text-gray-600">Settings page coming soon...</p>
                  </div>
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
