import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = async (productId, quantity) => {
    try {
      const response = await fetch('http://localhost:3000/cart/see', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      setCart(data.items); // Update state dengan data dari backend
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:3000/cart/add', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      setCart(data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
