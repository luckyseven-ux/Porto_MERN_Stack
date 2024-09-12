import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../global/CartContext';

const ShoppingCartPage = () => {
  const [cart, setCart] = useState([]); // State untuk keranjang belanja
  const [selectedItems, setSelectedItems] = useState([]); // State untuk item yang dipilih
  const { selectedProducts } = useCart();
  const navigate = useNavigate();

  // Fungsi untuk mengambil data cart dari server
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page jika belum login
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/cart/see', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setCart(data.items); // Perbarui state dengan data terbaru dari server
        } else {
          console.error('Failed to fetch cart:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
  
    fetchCart(); // Panggil fetchCart saat component dipasang
  }, []); // Kosongkan dependency array agar fetchCart hanya dipanggil sekali saat component dipasang
  
  
  // Menambah atau menghapus item dari list yang dipilih
  const toggleSelectItem = (index) => {
    const updatedSelectedItems = [...selectedItems];
    if (updatedSelectedItems.includes(index)) {
      // Hapus item jika sudah dipilih
      setSelectedItems(updatedSelectedItems.filter(item => item !== index));
    } else {
      // Tambah item jika belum dipilih
      updatedSelectedItems.push(index);
      setSelectedItems(updatedSelectedItems);
    }
  };

  const increaseQuantity = async (index) => {
    const updatedCart = [...cart];
    const productId = updatedCart[index].productId._id; // Ambil productId dari item yang akan di-update
  
    updatedCart[index].quantity += 1;
    setCart(updatedCart); // Perbarui state cart dengan jumlah terbaru
  
    // Kirim request ke backend untuk update quantity
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Sertakan token untuk autentikasi
        },
        body: JSON.stringify({ quantity: updatedCart[index].quantity })
      });
  
      if (!response.ok) {
        console.error('Failed to update cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };
  

  const decreaseQuantity = async (index) => {
    const updatedCart = [...cart];
    const productId = updatedCart[index].productId._id; // Ambil productId dari item yang akan di-update
  
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart); // Perbarui state cart dengan jumlah terbaru
  
      // Kirim request ke backend untuk update quantity
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/cart/update/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Sertakan token untuk autentikasi
          },
          body: JSON.stringify({ quantity: updatedCart[index].quantity })
        });
  
        if (!response.ok) {
          console.error('Failed to update cart:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      removeFromCart(index); // Hapus item dari keranjang jika jumlahnya menjadi 0
    }
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/cart/see', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.items); // Perbarui state dengan data terbaru dari server
      } else {
        console.error('Failed to fetch cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }}
    const removeFromCart = async (index) => {
      const productId = cart[index].productId._id; // Mendapatkan productId dari item yang akan dihapus
      const newCart = [...cart]; 
      newCart.splice(index, 1); // Menghapus item dari state lokal
      setCart(newCart); // Perbarui state dengan item yang sudah dihapus secara lokal
    
      try {
        // Mendapatkan token dari localStorage untuk autentikasi
        const token = localStorage.getItem('token');
    
        // Mengirim permintaan DELETE ke backend untuk menghapus item dari database
        const response = await fetch(`http://localhost:3000/cart/drop/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Sertakan token untuk autentikasi
          },
        });
    
        if (response.ok) {
          // Jika berhasil, tampilkan pesan sukses dan fetch ulang cart dari server
          console.log('Product removed from cart successfully');
          fetchCart(); // Ambil data cart terbaru dari server
        } else {
          // Jika gagal, tampilkan pesan error
          console.error('Failed to remove product from cart:', response.statusText);
          // Kembalikan item ke state jika gagal dihapus di backend
          setCart(cart); // Kembalikan cart ke kondisi sebelum penghapusan
        }
      } catch (error) {
        // Tangani kesalahan jaringan atau lainnya
        console.error('Error removing product from cart:', error);
        // Kembalikan item ke state jika gagal
        setCart(cart); // Kembalikan cart ke kondisi sebelum penghapusan
      }
    
      // Hapus item dari list yang dipilih jika dihapus dari keranjang
      setSelectedItems(selectedItems.filter(item => item !== index));
    };
    
  
  
  useEffect(() => {
    if (selectedProducts.length === 0) {
      navigate('/cart'); // Redirect ke cart jika tidak ada barang yang dipilih
    }
  }, [selectedProducts, navigate]);
  // Menghitung total harga dari item yang dipilih
  const calculateTotal = () => {
    return selectedItems.reduce((total, selectedIndex) => {
      const selectedItem = cart[selectedIndex];
      return total + selectedItem.productId.price * selectedItem.quantity;
    }, 0);
  };
  
  const handleCheckout = () => {
  const selectedProducts = selectedItems.map(i => cart[i]);
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
  console.log("Selected Products: ", selectedProducts);
  navigate('/checkout'); // Navigasi tanpa perlu kirim state
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-zinc-600 to-green-950 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">MyCart</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Cart:</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-4" 
                    checked={selectedItems.includes(index)} 
                    onChange={() => toggleSelectItem(index)} 
                  />
                  <span className="font-medium text-gray-700">{item.productId.name} (x{item.quantity})</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <button 
                      onClick={() => decreaseQuantity(index)} 
                      className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 bg-white border-t border-b text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => increaseQuantity(index)} 
                      className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-r"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">Rp{item.productId.price * item.quantity}</span>
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
        
        {selectedItems.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <strong className="text-xl font-bold text-gray-800">Total:</strong>
              <strong className="text-2xl text-green-600">Rp{calculateTotal()}</strong>
            </div>
            <button 
              className="mt-6 w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
              onClick={handleCheckout}
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
