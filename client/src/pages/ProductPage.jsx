import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../component/Popup';
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/product/see'); // Backend URL
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage
      const response = await fetch('http://localhost:3000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Sertakan token di sini
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
  
      if (response.ok) {
        console.log('Product added to cart successfully');
        setPopupVisible(true);

    // Sembunyikan popup setelah 3 detik
    setTimeout(() => {
      setPopupVisible(false);
    }, 3000);
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/product/drop/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error occurred while deleting product.');
    }
  };

  return (
    <div className="p-6 bg-slate-600 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Product List</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-amber-400  rounded-lg overflow-hidden shadow-lg">
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500 mb-2">{product.currency}{product.price}</p>
                <button
                  onClick={() => addToCart({ ...product, quantity: 1 })}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
                >
                  Add to Cart
                </button>
                <Popup message="Product added to cart" visible={popupVisible} />

                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded w-full"
                >
                  Delete Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
