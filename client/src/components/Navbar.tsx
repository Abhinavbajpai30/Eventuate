import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUsername(payload.username || 'U');
            } catch {
                setUsername('U');
            }
        } else {
            setIsLoggedIn(false);
            setUsername('');
        }
    }, []);

    return (
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600"><NavLink to={"/"}>Eventuate</NavLink></div>
            <ul className="flex space-x-6">
              <li><NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}>Home</NavLink></li>
              <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}>Events</NavLink></li>
              <li><NavLink to="/profile" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}>Profile</NavLink></li>
            </ul>
            <div>
              {!isLoggedIn ? (
                <>
                  <NavLink to={"/login"} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">Login</NavLink>
                  <NavLink to={"/signup"} className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 text-blue-600">Sign Up</NavLink>
                </>
              ) : (
                <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-700 shadow hover:bg-blue-300 transition">
                  {username ? username[0].toUpperCase() : 'U'}
                </button>
              )}
            </div>
          </div>
        </nav>
      );
}

export default Navbar