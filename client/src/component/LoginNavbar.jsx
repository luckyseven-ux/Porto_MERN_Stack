import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../global/ThemeContext';
import { BellRinging } from '@phosphor-icons/react';

const Navbar = ({ isLoggedIn }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleDropdownToggle = () => setShowDropdown(!showDropdown);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const klik = event.currentTarget.value;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if not authenticated
    } 
    setIsLoading(false); // Pastikan ini selalu dipanggil
  }, [navigate]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        handleLogout();
      }
    };

    const interval = setInterval(checkTokenExpiration, 3600000); // Setiap 1 jam

    return () => clearInterval(interval);
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className={`w-full h-16 flex items-center justify-between px-4 md:px-6 ${darkMode ? 'bg-blue-950 text-white' : 'bg-slate-300 text-gray-900'}`}>
    <h1 className="text-3xl font-bold">HelmetAI</h1>
    <div className="flex items-center space-x-6">
      <input type="text" placeholder="Search..." className="py-1 px-2 rounded text-black" />
      <button type="submit" className="scale-125 hover:scale-150 text-lg">🔎</button>
  
      {isLoggedIn ? (
        <>
          <div className="relative">
            <button onClick={handleDropdownToggle} className="flex items-center focus:outline-none">
              <UserIcon className="w-8 h-8" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2">
                <Link to="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">Account</Link>
                <Link to="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">Settings</Link>
                <Link to="/" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">Logout</Link>
              </div>
            )}
          </div>
          <Link to="#" className="hover:underline"><BellRinging size={32} /></Link>
        </>
      ) : (
        <Link to="/login" className="hover:underline">Login</Link>
      )}
  
  <button onClick={toggleTheme} className="hover:underline">
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
    </div>
  </div>

  );
};

function MoonIcon(props) {
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
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function SunIcon(props) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function UserIcon(props) {
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
      <path d="M12 14c-1.333 0-4 0-4-2s1.667-3 4-3 4 1 4 3-2.667 2-4 2zm0 6a4.5 4.5 0 01-4.5-4.5h9A4.5 4.5 0 0112 20zm0-18C9.344 2 7 4.344 7 7s2.344 5 5 5 5-2.344 5-5-2.344-5-5-5z" />
    </svg>
  );
}

export default Navbar;
