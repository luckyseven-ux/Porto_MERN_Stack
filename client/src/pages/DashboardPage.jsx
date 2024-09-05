import React, { useEffect, useState } from 'react';
import Navbar from '../component/LoginNavbar';
import Sidebar from '../component/Sidebar';

import { useTheme } from '../global/ThemeContext';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login page if not authenticated
    } else {
      setIsAuthenticated(true);
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
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-slate-200 text-gray-900'}`}>
      <Navbar isLoggedIn={isAuthenticated} />
   <Sidebar/>
          <div className="flex flex-col items-center justify-center pt-8">
            <h1 className="text-5xl font-bold">Dashboard</h1>
            
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => navigate('/productlist')}
            >
              product
            </button>
          </div>
          </div>
        
      

  );
}

export default DashboardPage;
