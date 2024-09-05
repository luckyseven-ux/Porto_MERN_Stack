import React, { useState } from 'react';

const CheckoutPage = ({ cart, onCheckout, customerDetails, setCustomerDetails }) => {
  // Menghitung total harga
  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  // Fungsi untuk menangani pengiriman data checkout
  const handleCheckout = () => {
    onCheckout();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Your Cart:</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between mb-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <strong>Total: ${calculateTotal()}</strong>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Customer Details:</h3>
        <input
          type="text"
          placeholder="First Name"
          className="w-full border rounded px-3 py-2 mb-2"
          value={customerDetails.first_name}
          onChange={(e) => setCustomerDetails({ ...customerDetails, first_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full border rounded px-3 py-2 mb-2"
          value={customerDetails.last_name}
          onChange={(e) => setCustomerDetails({ ...customerDetails, last_name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2 mb-2"
          value={customerDetails.email}
          onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone"
          className="w-full border rounded px-3 py-2 mb-2"
          value={customerDetails.phone}
          onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
        />
      </div>

      <button
        onClick={handleCheckout}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={cart.length === 0 || !customerDetails.first_name || !customerDetails.email}
      >
        Complete Purchase
      </button>
    </div>
  );
};

export default CheckoutPage;
