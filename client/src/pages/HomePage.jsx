import React from 'react';
import Sidebar from '../component/Sidebar';
import Navbar from '../component/Navbar';

function Home() {
  return (
    <div className="bg-slate-800 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-8 pt-20  justify-center flex">
          <h1 className="text-white text-5xl  font-bold">Halaman Utama</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
