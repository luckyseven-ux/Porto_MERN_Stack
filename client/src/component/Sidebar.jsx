import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../global/ThemeContext';

const Sidebar = () => {
  const { darkMode } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const toggleSidebar = () => setIsMinimized(!isMinimized);

  return (
    <div className={`${isMinimized ? 'w-20' : 'w-64'} space-y-6 py-7 px-2 fixed top-0 left-0 h-full transition-all duration-300 ${darkMode ? 'bg-blue-950 text-white' : 'bg-slate-300 text-gray-900'}`}>
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          
          {!isMinimized && <span className="text-3xl font-bold top-1">HelmetAI</span>}
        </div>
      </div>
      <nav className={`mt-4 ${isMinimized ? 'hidden' : 'block'}`}>
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">Dashboard</Link>
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">Team</Link>
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">Projects</Link>
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">Calendar</Link>
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">Documents</Link>
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">Reports</Link>
      </nav>
      <div className={`mt-4 ${isMinimized ? 'hidden' : 'block'}`}>
        <p className="text-gray-400 px-4">Your teams</p>
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
          <span className="bg-indigo-600 text-white rounded-full h-6 w-6 inline-block mr-2 text-center">H</span>
          Heroicons
        </Link>
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
          <span className="bg-indigo-600 text-white rounded-full h-6 w-6 inline-block mr-2 text-center">T</span>
          Tailwind Labs
        </Link>
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
          <span className="bg-indigo-600 text-white rounded-full h-6 w-6 inline-block mr-2 text-center">W</span>
          Workcation
        </Link>
      </div>
      <div className="mt-6">
        <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
          <span className="bg-indigo-600 text-white rounded-full h-6 w-6 inline-block mr-2 text-center">⚙️</span>
          {!isMinimized && 'Settings'}
        </Link>
        <button onClick={toggleSidebar} className="text-white px-2 py-1">
          {isMinimized ? '>' : '<'}
        </button>
      </div>
    </div>
  );
};

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

export default Sidebar;
