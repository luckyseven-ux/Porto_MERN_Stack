import React, { useState } from 'react';

const Popup = ({ message, visible }) => {
  return (
    <div
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ${
        visible ? 'opacity-100 bottom-10' : 'opacity-0 bottom-5'
      }`}
    >
      <span className="text-green-500 text-xl">&#10004;</span>
      <p>{message}</p>
    </div>
  );
};

export default Popup;
