import React from 'react'
import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600"><NavLink to={"/"}>Eventuate</NavLink></div>
            <ul className="flex space-x-6">
              <li><a href="#features" className="text-gray-700 hover:text-blue-600">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-700 hover:text-blue-600">How It Works</a></li>
              <li><a href="#testimonials" className="text-gray-700 hover:text-blue-600">Testimonials</a></li>
              <li><a href="#events" className="text-gray-700 hover:text-blue-600">Events</a></li>
              <li><a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a></li>
            </ul>
            <div>
              <NavLink to={"/login"} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">Login</NavLink>
              <NavLink to={"/signup"} className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 text-blue-600">Sign Up</NavLink>
            </div>
          </div>
        </nav>
      );
}

export default Navbar