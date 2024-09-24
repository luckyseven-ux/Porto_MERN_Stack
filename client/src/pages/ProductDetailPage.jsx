import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // For fetching productId from URL
import Navbar from '../component/LoginNavbar';

const DetailProductPage = () => {
  const { productId } = useParams(); // Get productId from URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity set to 1
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // For navigation


  useEffect(() => {
    // Fetch product details based on productId
   const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect ke login jika tidak ada token
    }else {
      setIsAuthenticated(true);
    }
  
    const getProductById = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await fetch(`http://localhost:3000/product/see/${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include token in header
          },
        });

        if (response.ok) {
          const productData = await response.json(); // Parse product data
          setProduct(productData); // Set product to state
        } else {
          alert('Failed to fetch product.');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Error occurred while fetching product.');
      }
    };

    if (productId) {
      getProductById(); // Call function if productId is available
    }
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await fetch('http://localhost:3000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in header
        },
        body: JSON.stringify({ productId: product._id, quantity }), // Send productId and quantity
      });

      if (response.ok) {
        console.log('Product added to cart successfully');
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { product, quantity } }); // Navigate to checkout with selected product and quantity
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  return product ? (
    <div className=" bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen text-white">
      <Navbar isLoggedIn={isAuthenticated}/>
      <button className='bg-green-600 rounded-md px-7 py-1 text-white text-2xl flex flex-col font-semibold justify-between items-center hover:scale-105 hover:shadow-2xl cursor-pointer' onClick={()=>navigate('/productlist')}>Kembali</button>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <img 
            src={product.image} 
            alt={product.name} 
            className="mx-7  w-full max-h-[500px] rounded-lg shadow-lg transition-transform transform hover:scale-105 object-cover"
          />
        </div>
        <div className=" mr-5  my-3 flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-red-500 mb-6">Rp{product.price.toLocaleString()}</p>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Detail Produk</h2>
            <p className="mb-2">Kondisi: Baru <span className="font-semibold">{product.condition}</span></p>
            <p className="mb-2">Min. Pemesanan: <span className="font-semibold">{product.minOrder} Buah</span></p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Variasi</h2>
            <p>{product.variants?.length ? product.variants.join(", ") : "Tidak ada variasi tersedia"}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Atur Jumlah</h2>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={product.minOrder}
              max={product.stock}
              className="border-2 border-gray-400 p-2 w-20 rounded-md"
            />
            
            <p className='mt-2'>Min. pembelian: 1 {product.minOrder} pcs</p>
            <p className="font-bold text-xl mt-4">Subtotal: Rp. {(product.price * quantity).toLocaleString()}</p>
            <p className='text-justify mt-2'><strong>Deskripsi :</strong><br />{product.description}</p>
            <p className='mt-2 mb-2'><strong>Stok : </strong>{product.quantity}</p>
            <p><strong>Weight : </strong>{product.weight} gram</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              + Keranjang
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              Beli Langsung
            </button>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-2">{product.storeName}</h2>
            <p className="text-gray-400 mb-1">Online kemarin</p>
            <p className="text-yellow-400">Rating: {product.storeRating} ({product.storeReviewCount} Ulasan)</p>
            <p className="text-gray-400">{product.processingTime}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default DetailProductPage;
