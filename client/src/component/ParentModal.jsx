import React, { useState } from 'react';
import AddressModal from './AddressModal'; // Import AddressModal

const ParentComponent = () => {
  const [showModal, setShowModal] = useState(false); // State untuk kontrol modal

  const handleCloseModal = () => {
    setShowModal(false); // Fungsi untuk menutup modal
  };

  const handleOpenModal = () => {
    setShowModal(true); // Fungsi untuk membuka modal
  };

  return (
    <div>
      <h1>Daftar Alamat</h1>

      {/* Tombol untuk membuka modal */}
      <button
        onClick={handleOpenModal} // Fungsi untuk membuka modal
        className="flex items-center mt-4 text-blue-500"
      >
        <span className="mr-2">+</span> Tambah Alamat
      </button>

      {/* Jika showModal true, tampilkan AddressModal */}
      {showModal && (
        <AddressModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ParentComponent;
