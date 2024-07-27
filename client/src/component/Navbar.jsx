import React, { useState, useEffect } from 'react';
import {useNavigate} from'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
  const navigate=useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    const newTheme = darkMode ? 'light' : 'dark';
    document.documentElement.classList.remove(darkMode ? 'dark' : 'light');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={`h-screen ${darkMode ? 'dark' : 'light'}`}>
      <div className="bg-blue-800 text-white w-full py-4 px-4 fixed top-0 left-0 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM7 4h3a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1V4zM17 4a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4a1 1 0 011-1h3zM7 10h3a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1zM17 10a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3a1 1 0 011-1h3zM7 16h3a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1zM17 16a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3a1 1 0 011-1h3z" />
          </svg>
          <span className="text-2xl font-extrabold">Logo</span>
        </div>
        <div className="flex items-center space-x-6">
          <input type="text" placeholder="Search..." className="py-1 px-2 rounded text-black" />
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={handleDropdownToggle} className="flex items-center focus:outline-none">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-1.333 0-4 0-4-2s1.667-3 4-3 4 1 4 3-2.667 2-4 2zm0 6a4.5 4.5 0 01-4.5-4.5h9A4.5 4.5 0 0112 20zm0-18C9.344 2 7 4.344 7 7s2.344 5 5 5 5-2.344 5-5-2.344-5-5-5z" />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">Account</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">Logout</a>
                </div>
              )}
            </div>
          ) : (
            <a href="#" className="hover:underline" onClick={()=>navigate('/login')}>Login</a>
          )}
          <button onClick={toggleTheme} className="hover:underline">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <a href="#" className="hover:underline">Notifications</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
