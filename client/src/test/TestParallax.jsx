import React from 'react';
import parallax1 from '../img/parallax1.jpg'; // pastikan path sesuai

function TestParallax() {
  return (
    <div style={{
      height: '100vh',
      backgroundImage: `url(${parallax1})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <h1 style={{ color: 'white' }}>Parallax Image</h1>
    </div>
  );
}

export default TestParallax;
