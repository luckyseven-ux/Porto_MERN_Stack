import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddressModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]); // State untuk provinsi
  const [isLoading, setIsLoading] = useState(false); // Untuk loading state saat mengirim data
  const navigate = useNavigate();

  // State untuk menampung data alamat
  const [address, setAddress] = useState({
    street: '',
    cityId: '',
    postalCode: '',
    provinceId: '', // Mengganti 'province' menjadi 'provinceId' agar konsisten dengan API
    isDefault: false,
    receiverName: '',
    phone: '',
  });

  // Mengambil daftar kota dari backend lokal
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:3000/address/city', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCities(data); // Menggunakan daftar kota dari backend
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();

    // Mengambil daftar provinsi dari backend lokal
    const fetchProvinces = async () => {
      try {
        const response = await fetch('http://localhost:3000/address/prov', { // Menggunakan endpoint provinsi yang benar
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setProvinces(data); // Menggunakan daftar provinsi dari backend
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Fungsi untuk menangani perubahan input form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Fungsi untuk melanjutkan ke step berikutnya
  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  // Fungsi submit untuk mengirim data ke server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const addressData = {
      receiverName: address.receiverName,
      phone: address.phone,
      address: address.street,
      cityId: address.cityId, // CityId yang berasal dari API backend
      postalCode: address.postalCode,
      provinceId: address.provinceId, // ProvinceId dari API backend
      isDefault: address.isDefault,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/address/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        console.log('Address added successfully');
        navigate('/checkout'); // Setelah berhasil simpan, arahkan ke halaman checkout
      } else {
        console.error('Failed to add address');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Tambah Alamat</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="mb-4">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Nama Jalan / Gedung / Perumahan
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="provinceId" className="block text-sm font-medium text-gray-700">
                  Provinsi
                </label>
                <select
                  id="provinceId"
                  name="provinceId"
                  value={address.provinceId}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((province) => (
                    <option key={province.province_id} value={province.province_id}>
                      {province.province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="cityId" className="block text-sm font-medium text-gray-700">
                  Kota
                </label>
                <select
                  id="cityId"
                  name="cityId"
                  value={address.cityId}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Pilih Kota</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Kode Pos
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={address.isDefault}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Jadikan sebagai alamat utama
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Batal
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Lanjut ke Step 2
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4">
                <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  id="receiverName"
                  name="receiverName"
                  value={address.receiverName}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Menambahkan...' : 'Simpan Alamat'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
