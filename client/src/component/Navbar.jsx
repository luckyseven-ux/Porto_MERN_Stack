import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../global/ThemeContext';

const Navbar = ({ isLoggedIn }) => {
  const { darkMode, toggleTheme } = useTheme();
  const handleSearch =(event)=>{
    event.preventDefault()
    const klik = event.currentTarget.value
  }
  return (
    <div className={`w-full h-16 flex items-center justify-between px-4 md:px-6 ${darkMode ? 'bg-blue-950 text-white' : 'bg-slate-300 text-gray-900'}`}>
      <h1 className='text-3xl font-bold'>HelmetAI</h1>
      <div className="flex items-center space-x-6">
        <input type="text" placeholder="Search..." className="py-1 px-2 rounded text-black" />
        <button type='submit' className='scale-125 hover:scale-150 text-lg'>🔎</button>
        <Link to="/login" className="hover:underline">Login</Link>
        <button onClick={toggleTheme} className="hover:underline">
          {darkMode ? <h1>Sun</h1> : <h1>Moon</h1>}
        </button>
      </div>
    </div>
  );
};




export default Navbar;
