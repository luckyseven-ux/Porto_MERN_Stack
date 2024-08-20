import React from 'react';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import { useTheme } from '../global/ThemeContext';

function HomePage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-slate-200 text-gray-900'}`}>
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-8">
        <h1 className="text-5xl font-bold">Welcome To Our Website</h1>
        <p className="mt-4 text-lg">Please login for access to other menus.</p>
      </div>
    </div>
  );
}

export default HomePage;
