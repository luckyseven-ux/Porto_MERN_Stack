import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  return (
    <CartContext.Provider value={{ selectedProducts, setSelectedProducts }}>
      {children}
    </CartContext.Provider>
  );
};
