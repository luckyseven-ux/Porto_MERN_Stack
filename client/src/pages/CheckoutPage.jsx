import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddressPopup from "../pages/popup/AddressPopup";
import Navbar from "../component/LoginNavbar";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState(
    location.state?.selectedProducts || []
  );
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const [customerDetails, setCustomerDetails] = useState({
    userId: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  // Hitung total harga
  const calculateTotal = useMemo(() => {
    return selectedProducts.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);
  }, [selectedProducts]);

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setIsAuthenticated(true);

      try {
        const fetchUserProfile = async () => {
          const response = await fetch("http://localhost:3000/user/see", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setCustomerDetails({
              userId: userData.userId,
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              phone: userData.phone,
            });
          } else {
            console.error("Failed to fetch user profile");
          }
        };

        await fetchUserProfile();

        if (selectedProducts.length > 0) {
          const addressResponse = await fetch(
            "http://localhost:3000/address/see",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (addressResponse.ok) {
            const addressData = await addressResponse.json();
            const defaultAddr = addressData.find(
              (address) => address.isDefault
            );
            setDefaultAddress(defaultAddr || null);

            if (defaultAddr) {
              const fetchShippingOptions = async () => {
                const totalWeight = selectedProducts.reduce((total, item) => {
                  const weight = item.productId?.weight || 0;
                  return total + weight * item.quantity;
                }, 0);
              
                if (totalWeight === 0) {
                  console.error(
                    "Total weight is 0, cannot proceed with shipping calculation."
                  );
                  return;
                }
              
                const shippingDataPayload = {
                  origin: "501",
                  destination: defaultAddr.cityId, // Pastikan defaultAddr.cityId valid
                  weight: totalWeight,
                  courier: "jne",
                };
              
                try {
                  const shippingResponse = await fetch(
                    "http://localhost:3000/address/shiping", // URL yang benar
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Pastikan token valid
                      },
                      body: JSON.stringify(shippingDataPayload),
                    }
                  );
              
                  if (shippingResponse.ok) {
                    const shippingData = await shippingResponse.json();
                    console.log("Shipping Data Response:", shippingData); // Tambahkan ini
                    setShippingOptions(shippingData.rajaongkir?.results || []); // 
                  } else {
                    const errorResponse = await shippingResponse.text();
                    console.error("Failed to fetch shipping options:", errorResponse);
                  }
                } catch (error) {
                  console.error("Error occurred while fetching shipping options:", error);
                }
              };
              
               fetchShippingOptions() ,[];
            } else {
              console.error("No default address found");
            }
          } else {
            console.error("Failed to fetch address data");
          }
        } else {
          console.error("No products selected.");
        }
      } catch (error) {
        console.error("Error during user authentication:", error);
      }
    };

    if (selectedProducts.length === 0) {
      const savedProducts = localStorage.getItem("selectedProducts");
      if (savedProducts) {
        setSelectedProducts(JSON.parse(savedProducts));
      } else {
        navigate("/cart");
      }
    } else {
      authenticateUser();
    }
  }, [navigate, selectedProducts.length]);

  const handleCheckout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const selectedProduct = selectedProducts[0];
      if (!selectedProducts.length) {
        console.error("Tidak ada produk yang dipilih.");
        return;
      }

      const requestData = {
        productId: selectedProduct.productId,
        quantity: selectedProduct.quantity || 1,
        customerDetails,
      };

      const response = await fetch("http://localhost:3000/transaction/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error(
          "Gagal memulai transaksi:",
          data.error || "Error tidak diketahui"
        );
      }
    } catch (error) {
      console.error("Error memulai transaksi:", error);
    }
  }, [selectedProducts, customerDetails]);

  const handleShippingChange = (event) => {
    setSelectedShipping(event.target.value);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('./src/img/bg2.jpg')" }}
    >
      <Navbar isLoggedIn={isAuthenticated} />
      <div className="flex space-x-8 p-8">
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Pengiriman</h2>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold">ALAMAT PENGIRIMAN</h3>
            {defaultAddress ? (
              <p className="mt-2">
                <span className="font-semibold">{defaultAddress.address}</span>{" "}
                - {defaultAddress.receiverName}
                <br />
                {defaultAddress.cityName}, {defaultAddress.province},{" "}
                {defaultAddress.postalCode}, {defaultAddress.phone}
              </p>
            ) : (
              <p>Alamat default tidak ditemukan.</p>
            )}
            <AddressPopup />
          </div>

          <div>
            {selectedProducts.length > 0 ? (
              selectedProducts.map((item, index) => (
                <div key={index} style={{ marginBottom: "16px" }}>
                  <img
                    className="rounded-md"
                    src={item.productId.image}
                    alt={item.productId.name}
                    style={{ width: "100px", height: "100px" }}
                  />
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
            <label
              htmlFor="shipping"
              className="block text-sm font-medium text-gray-700"
            >
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
  {Array.isArray(shippingOptions) && shippingOptions.length > 0 && shippingOptions[0].costs ? (
    shippingOptions[0].costs.map((option, index) => {
      // Logging untuk melihat apakah datanya benar
      console.log("Service:", option.service, "Cost:", option.cost[0]?.value);

      return (
        <option key={index} value={option.service}>
          {option.service} - Rp{option.cost[0]?.value}
        </option>
      );
    })
  ) : (
    <option disabled>Opsi pengiriman tidak tersedia</option>
  )}
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
