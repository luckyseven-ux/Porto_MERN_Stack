import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddressModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Untuk loading state saat mengirim data
  const navigate = useNavigate();

  // State untuk menampung data alamat
  const [address, setAddress] = useState({
    street: '',
    cityId: '',
    postalCode: '',
    province: '',
    isDefault: false,
    receiverName: '',
    phone: '',
  });

  // Mengambil daftar kota dari API RajaOngkir
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://api.rajaongkir.com/starter/city', {
          headers: {
            key: 'API_KEY_RAJAOngkir', // Ganti dengan API Key RajaOngkir Anda
          },
        });
        const data = await response.json();
        setCities(data.rajaongkir.results);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
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
      address: address.street, // Menggunakan 'street' sebagai bagian dari alamat
      cityId: address.cityId, // CityId yang berasal dari API RajaOngkir
      postalCode: address.postalCode,
      province: address.province,
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
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                  Provinsi
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={address.province}
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
                  onClick={()=>navigate('/checkout')}
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
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Alamat'}
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
