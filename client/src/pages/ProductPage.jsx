import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../component/Popup';
import Navbar from '../component/LoginNavbar';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state untuk produk
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Cek token saat component dimount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect ke login jika tidak ada token
    }else {
      setIsAuthenticated(true);
    }

  }, [navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/product/see'); // Backend URL
        if (response.ok) {
          const data = await response.json();
          setProducts(data); // Simpan produk ke state
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        setError("Error fetching products");
      } finally {
        setLoading(false); // Set loading selesai setelah data diambil
      }
    };

    fetchProducts();
  }, []);

  // Tambah produk ke keranjang
  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage
      if (!token) {
        navigate("/login"); // Redirect jika tidak ada token
        return;
      }

      const response = await fetch('http://localhost:3000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Sertakan token
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
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

  // Hapus produk
  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/product/drop/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Sertakan token
        },
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId)); // Update produk setelah dihapus
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error occurred while deleting product.');
    }
  };

  // Navigate ke detail produk
  const goToProductDetail = (productId) => {
    navigate(`/productdetail/${productId}`); // Navigasi ke halaman detail produk
  };

  if (loading) {
    return <div>Loading products...</div>; // Menampilkan loading
  }
  
  if (error) {
    return <div>Error: {error}</div>; // Menampilkan error
  }
  
  return (
    <div className=" bg-gradient-to-b from-slate-700 to-slate-900 min-h-screen " >
      <Navbar isLoggedIn={isAuthenticated}  className='min-h-screen'/>
     
      <button className='bg-green-600 rounded-md px-7 py-1 text-white text-2xl flex flex-col font-semibold justify-between items-center hover:scale-105 hover:shadow-2xl cursor-pointer' onClick={()=>navigate('/dashboard')}>Dashboard</button>
  <h1 className="text-4xl font-bold mb-8 text-white text-center">Product List</h1>
  {products.length === 0 ? (
    <p className="text-center text-white">No products available.</p>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {products.map((product) => (
        <div 
          key={product._id} 
          className="bg-amber-400 rounded-lg shadow-lg relative transition-all transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl cursor-pointer"
          onClick={() => goToProductDetail(product._id)}
        >
          {product.image && (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          <div className="p-4 text-center">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-700 mb-2">{product.currency}{product.price}</p>
            
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default ProductPage;



/**<button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full transition-all hover:bg-blue-600 active:scale-95 mb-2"
            >
              Add to Cart
            </button>
            <button
              onClick={() => deleteProduct(product._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full transition-all hover:bg-red-600 active:scale-95"
            >
              Delete Product
            </button>**/