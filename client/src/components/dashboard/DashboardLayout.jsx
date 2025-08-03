import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const DashboardLayout = ({ children, currentView }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(user?.accountType === 'both' ? 'attendee' : user?.accountType);

  const isOrganizer = currentRole === 'organizer' || currentRole === 'both';
  const isAttendee = currentRole === 'attendee' || currentRole === 'both';

  const organizerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { id: 'events', label: 'My Events', icon: EventIcon, path: '/dashboard/events' },
    { id: 'bookings', label: 'Event Bookings', icon: PeopleIcon, path: '/dashboard/bookings' },
    { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon, path: '/dashboard/analytics' }
  ];

  const attendeeMenuItems = [
    { id: 'discover', label: 'Browse Events', icon: SearchIcon, path: '/dashboard/discover' },
    { id: 'bookings', label: 'My Bookings', icon: BookmarkIcon, path: '/dashboard/bookings' },
    { id: 'insights', label: 'Personal Insights', icon: AnalyticsIcon, path: '/dashboard/insights' }
  ];

  const commonMenuItems = [
    { id: 'profile', label: 'Profile', icon: PersonIcon, path: '/profile' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/dashboard/settings' }
  ];

  const getMenuItems = () => {
    // If user has 'both' account type, show role-specific menu based on currentRole
    if (user?.accountType === 'both') {
      if (currentRole === 'organizer') {
        return [...organizerMenuItems, ...commonMenuItems];
      } else {
        return [...attendeeMenuItems, ...commonMenuItems];
      }
    } else if (user?.accountType === 'organizer') {
      return [...organizerMenuItems, ...commonMenuItems];
    } else {
      // Default to attendee view
      return [...attendeeMenuItems, ...commonMenuItems];
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleRoleToggle = () => {
    if (user?.accountType === 'both') {
      setCurrentRole(currentRole === 'attendee' ? 'organizer' : 'attendee');
      // Redirect to appropriate dashboard
      if (currentRole === 'attendee') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/dashboard/discover';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Eventuate
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Role Toggle */}
          {user?.accountType === 'both' && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">View as:</span>
                <button
                  onClick={handleRoleToggle}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  {currentRole === 'attendee' ? 'Attendee' : 'Organizer'}
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-2">
            {getMenuItems().map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a
                    href={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </a>
                </motion.div>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <MenuIcon />
              </button>
              <h2 className="ml-4 text-xl font-semibold text-gray-900">
                {getMenuItems().find(item => item.id === currentView)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <NotificationsIcon />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 