import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ShoppingCartPage = () => {
  const [cart, setCart] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
     // Pastikan ini selalu dipanggil
   // Tambahkan ini untuk melihat nilai token di konsol
  }, [navigate]);// State untuk keranjang belanja

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/product/see'); // Backend URL
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Menghapus produk dari keranjang
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Menghitung total harga
  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-zinc-600 to-green-950 p-8">
  <h2 className="text-3xl font-extrabold mb-8 text-center text-white">MyCart</h2>
  
  <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
    <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Cart:</h3>
    {cart.length === 0 ? (
      <p className="text-gray-500">Your cart is empty.</p>
    ) : (
      <ul>
        {cart.map((item, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded-lg shadow-sm">
            <span className="font-medium text-gray-700">{item.name} (x{item.quantity})</span>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-800">Rp{item.price * item.quantity}</span>
              <button 
                onClick={() => removeFromCart(index)} 
                className="ml-4 text-red-500 hover:text-red-700 font-semibold transition-colors"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
    
    {cart.length > 0 && (
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center">
          <strong className="text-xl font-bold text-gray-800">Total:</strong>
          <strong className="text-2xl text-green-600">Rp{calculateTotal()}</strong>
        </div>
        <button 
          className="mt-6 w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
        >
          Checkout
        </button>
      </div>
    )}
  </div>
</div>

  );
};

export default ShoppingCartPage;
