import React, { useState, useEffect } from 'react';

const Sidebar = ({ isLoggedIn }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  const toggleSidebar = () => setIsMinimized(!isMinimized);

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`bg-indigo-700 text-white ${isMinimized ? 'w-20' : 'w-64'} space-y-6 py-7 px-2 fixed top-0 left-0 h-full transition-all duration-300`}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM7 4h3a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1V4zM17 4a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4a1 1 0 011-1h3zM7 10h3a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1zM17 10a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3a1 1 0 011-1h3zM7 16h3a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1zM17 16a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3a1 1 0 011-1h3z" />
            </svg>
            {!isMinimized && <span className="text-2xl font-extrabold">Logo</span>}
          </div>
        </div>
        <nav className={`mt-4 ${isMinimized ? 'hidden' : 'block'}`}>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Dashboard</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Team</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Projects</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Calendar</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Documents</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">Reports</a>
        </nav>
        <div className={`mt-4 ${isMinimized ? 'hidden' : 'block'}`}>
          <p className="text-gray-400 px-4">Your teams</p>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
            <span className="bg-indigo-600 text-white rounded-full h-6 w-6 inline-block mr-2 text-center">H</span>
            Heroicons
          </a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
            <span className="bg-indigo-600 text-white rounded-full h-6 w-6 inline-block mr-2 text-center">T</span>
            Tailwind Labs
          </a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
            <span className="bg-indigo-600 text-white rounded-full h-6 w-6 inline-block mr-2 text-center">W</span>
            Workcation
          </a>
        </div>
        <div className="mt-6">
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
            <span className="bg-indigo-600 text-white rounded-full h-6 w-6 inline-block mr-2 text-center">⚙️</span>
            {!isMinimized && 'Settings'}
          </a>
          <button onClick={toggleSidebar} className="text-white px-2 py-1">
            {isMinimized ? '>' : '<'}
          </button>
          <button onClick={toggleTheme} className="text-white px-2 py-1 ml-2">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
