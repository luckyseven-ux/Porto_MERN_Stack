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

  // Handle setting default address
  const handleDefault = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Anda perlu login terlebih dahulu.');
        // Arahkan pengguna ke halaman login atau tangani sesuai kebutuhan
        return;
      }
  
      const response = await fetch(`http://localhost:3000/address/default/${addressId}`, {
        method: 'POST', // POST method untuk mengubah alamat default
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ addressId }), // Kirim addressId sebagai body request
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Data fetched:', data);
        alert('Berhasil di set sebagai alamat utama');
  
        // Refresh addresses state: mengubah status default pada UI
        setAddresses((prevAddresses) =>
          prevAddresses.map((address) =>
            address._id === addressId
              ? { ...address, isDefault: true }
              : { ...address, isDefault: false }
          )
        );
      } else if (response.status === 401) {
        alert('Otentikasi gagal. Silakan login kembali.');
        // Arahkan ke login
      } else {
        let errorMessage = 'Terjadi kesalahan.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Jika respons tidak JSON, tetap gunakan pesan default
        }
        console.error('Failed to set default address:', errorMessage);
        alert(`Gagal mengatur alamat default: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Terjadi kesalahan saat mengatur alamat default. Silakan coba lagi.');
    }
  };
  
  

  // Handle deleting address
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
        className=" mt-3 ml-7 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Ganti Alamat
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
                <div className="flex items-center">
                  {address.isDefault ? (
                    <span className="text-green-500 mr-4">Default</span>
                  ) : (
                    <button
                      onClick={() => handleDefault(address._id)}
                      className="text-blue-500 bg-gray-200 px-3 py-1 rounded-lg mr-4"
                    >
                      Jadikan Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="text-red-500 bg-gray-200 px-3 py-1 rounded-lg"
                  >
                    Hapus
                  </button>
                </div>
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
