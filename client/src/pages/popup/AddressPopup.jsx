import React, { useState, useEffect } from 'react';
import Modal from '../../component/AddressModal';
import { useNavigate } from 'react-router-dom';

const AddressPopup = () => {
  const [addresses, setAddresses] = useState([]); // Pastikan addresses didefinisikan sebagai array kosong di awal
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch addresses when component mounts
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/address/see', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Data fetched:', data); // Cek data yang diterima dari API
          setAddresses(data || []); // Set ke state addresses
        } else {
          console.error('Failed to fetch addresses:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
  
    fetchAddresses();
  }, []);
  
  const handleDelete = async (addressId) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus alamat ini?');
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/address/drop/${addressId}`, {  // Ubah ke URL backend
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setAddresses(addresses.filter((address) => address._id !== addressId));
        alert('Alamat berhasil dihapus');
      } else {
        alert('Gagal menghapus alamat');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };
  

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Lihat Alamat
      </button>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-lg font-bold mb-4">Alamat yang sudah ada</h2>
        {/* Pastikan addresses adalah array sebelum melakukan map */}
        <ul>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <li
                key={address._id}
                className="border p-4 flex justify-between items-center mb-4 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium">{address.receiverName}</p>
                  <p>{address.address}, {address.cityName}, {address.province}, {address.postalCode}</p>
                </div>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-red-500 bg-gray-200 px-3 py-1 rounded-lg"
                >
                  Hapus
                </button>
              </li>
            ))
          ) : (
            <p>Tidak ada alamat yang tersedia.</p> // Tampilkan pesan jika tidak ada alamat
          )}
        </ul>

        <button
          
          onClick={() => navigate('/address')}
          className="flex items-center mt-4 text-blue-500"
        >
          <span className="mr-2">+</span> Tambah Alamat
        </button>
      </Modal>
    </div>
  );
};

export default AddressPopup;
