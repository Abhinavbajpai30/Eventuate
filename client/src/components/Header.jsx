import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle, Logout } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = ['Home', 'Browse Events', 'List Event', 'About', 'Contact'];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const drawer = (
    <div onClick={handleDrawerToggle} className="text-center">
      <h6 className="my-4 text-lg font-semibold">Eventuate</h6>
      <ul>
        {navItems.map((item) => (
          <li key={item} className="py-2">
            <span className="text-center block">{item}</span>
          </li>
        ))}
        {isAuthenticated ? (
          <>
            <li className="py-2">
              <Link to="/profile" className="text-center block text-blue-600">
                Profile
              </Link>
            </li>
            <li className="py-2">
              <button 
                onClick={handleLogout}
                className="text-center block text-red-600 w-full"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="py-2">
              <Link to="/login" className="text-center block text-blue-600">
                Sign In
              </Link>
            </li>
            <li className="py-2">
              <Link to="/signup" className="text-center block text-blue-600">
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <header className="bg-white shadow-md text-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                  Eventuate
                </h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex gap-8">
                {navItems.map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 font-medium">
                      {item}
                    </button>
                  </motion.div>
                ))}
              </nav>
            )}

            {/* Auth Buttons */}
            <div className="flex gap-4 items-center">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600 hidden md:block">
                    Welcome, {user?.name}
                  </span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                    >
                      <AccountCircle className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <AccountCircle className="h-4 w-4" />
                      Profile
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      <Logout className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className="md:hidden"
              >
                <MenuIcon />
              </IconButton>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            backgroundColor: 'white'
          },
        }}
      >
        {drawer}
      </Drawer>
    </motion.div>
  );
};

export default Header; 