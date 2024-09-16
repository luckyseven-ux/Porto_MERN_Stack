import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddressPopup from '../pages/popup/AddressPopup';
import Navbar from '../component/LoginNavbar';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState(location.state?.selectedProducts || []);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const [customerDetails, setCustomerDetails] = useState({
    userId: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  // Calculate total price using useMemo
  const calculateTotal = useMemo(() => {
    return selectedProducts.reduce((total, item) => {
      if (!item.productId.price || isNaN(item.productId.price)) {
        console.error('Invalid price found in item:', item);
        return total;
      }
      return total + item.productId.price * item.quantity;
    }, 0);
  }, [selectedProducts]);

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // Redirect to login if not authenticated
        return;
      }

      setIsAuthenticated(true);

      try {
        // Fetch user profile and default address
        const fetchUserProfile = async () => {
          const response = await fetch('http://localhost:3000/user/see', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Sertakan token
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setCustomerDetails({
              userId: userData.userId,  // Pastikan userId sesuai dengan API
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              phone: userData.phone,
            });

            // Fetch default address
            const addressResponse = await fetch(`http://localhost:3000/addresses/see`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });

            if (addressResponse.ok) {
              const addressData = await addressResponse.json();
              const defaultAddr = addressData.find(address => address.isDefault);
              setDefaultAddress(defaultAddr || null);
            } else {
              console.error('Failed to fetch addresses');
            }
          } else {
            console.error('Failed to fetch user profile');
          }
        };

        await fetchUserProfile();

        // Fetch shipping options
        const fetchShippingOptions = async () => {
          const response = await fetch("https://api.rajaongkir.com/starter/city", {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const result = await response.json();
            setShippingOptions(result.data);
          } else {
            console.error('Failed to fetch shipping options:', response.statusText);
          }
        };

        await fetchShippingOptions();
      } catch (error) {
        console.error('Error during authentication or fetching data:', error);
      }
    };

    authenticateUser();

    if (selectedProducts.length === 0) {
      const savedProducts = localStorage.getItem('selectedProducts');
      if (savedProducts) {
        setSelectedProducts(JSON.parse(savedProducts));
      } else {
        navigate('/cart'); // Go back to cart if no data
      }
    }
  }, [navigate, selectedProducts.length]);

  const handleCheckout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const selectedProduct = selectedProducts[0];
      if (!selectedProduct || !selectedProduct.productId) {
        throw new Error('Invalid product selected');
      }

      const requestData = {
        productId: selectedProduct.productId,
        quantity: selectedProduct.quantity || 1,
        customerDetails,
      };

      const response = await fetch('http://localhost:3000/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error('Failed to initiate transaction:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error initiating transaction:', error);
    }
  }, [selectedProducts, customerDetails]);

  const handleShippingChange = (event) => {
    setSelectedShipping(event.target.value);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('./src/img/bg2.jpg')" }}>
      <Navbar isLoggedIn={isAuthenticated} />
      <div className="flex space-x-8 p-8">
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Pengiriman</h2>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold">ALAMAT PENGIRIMAN</h3>
            {defaultAddress ? (
              <p className="mt-2">
                <span className="font-semibold">{defaultAddress.address}</span> - {defaultAddress.receiverName}
                <br />
                {defaultAddress.cityName}, {defaultAddress.province}, {defaultAddress.postalCode}, {defaultAddress.phone}
              </p>
            ) : (
              <p>Alamat default tidak ditemukan.</p>
            )}
            <AddressPopup />
            <div className="flex mt-4 space-x-4">
              <button className="border border-gray-300 px-4 py-2 rounded-md">Ganti Alamat</button>
              <button className="border border-gray-300 px-4 py-2 rounded-md">Kirim ke Beberapa Alamat</button>
            </div>
          </div>

          <div>
            {selectedProducts.length > 0 ? (
              selectedProducts.map((item, index) => (
                <div key={index}>
                  <p>{item.productId.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: Rp {item.productId.price}</p>
                </div>
              ))
            ) : (
              <p>Tidak ada produk yang dipilih.</p>
            )}
          </div>

          <div className="mb-6 mt-6">
            <label htmlFor="shipping" className="block text-sm font-medium text-gray-700">
              Pilih Pengiriman
            </label>
            <select
              id="shipping"
              name="shipping"
              value={selectedShipping}
              onChange={handleShippingChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Pilih Pengiriman</option>
              {shippingOptions.map((option, index) => (
                <option key={index} value={option.service}>
                  {option.service} - Rp{option.cost}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-1/3 h-60 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-6">Ringkasan belanja</h3>
          <div className="flex justify-between mb-4">
            <span>Total Harga ({selectedProducts.length} Barang)</span>
            <span>Rp {calculateTotal}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Pilih Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
