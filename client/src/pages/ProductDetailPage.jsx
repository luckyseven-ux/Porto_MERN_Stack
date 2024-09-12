import React, { useState, useEffect } from 'react';

const DetailProductPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(10);

  useEffect(() => {
    // Fetch product data from API or database
    const fetchProducts = async (productId) => {
        try {
          const response = await fetch(`http://localhost:3000/product/see${productId}`); // Backend URL
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      fetchProducts();
    }, []);

  const handleAddToCart = async (product) => {
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
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleBuyNow = () => {
    const selectedProducts = selectedItems.map(i => cart[i]);
    navigate('/checkout', { state: { selectedProducts } }); // Mengarahkan ke halaman checkout dengan data produk yang dipilih
  };


  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  return product ? (
    <div className="flex p-6">
      <div className="flex-1">
        <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
      </div>
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-xl font-semibold text-red-600 mt-4">Rp{product.price.toLocaleString()}</p>

        <div className="mt-4">
          <h2 className="text-lg font-bold">Detail</h2>
          <p>Kondisi: {product.condition}</p>
          <p>Min. Pemesanan: {product.minOrder} Buah</p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-bold">Merk variasi</h2>
          <p>{product.variants.join(", ")}</p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-bold">Atur jumlah dan catatan</h2>
          <input 
            type="number" 
            value={quantity} 
            onChange={handleQuantityChange} 
            min={product.minOrder} 
            max={product.stock} 
            className="border p-2 w-20" 
          />
          <p className="mt-2">Stok Total: {product.stock}</p>
          <p>Min. pembelian {product.minOrder} pcs</p>
          <p className="font-bold text-xl mt-2">Subtotal Rp{(product.price * quantity).toLocaleString()}</p>
        </div>

        <div className="mt-4 flex">
          <button 
            onClick={handleAddToCart} 
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            + Keranjang
          </button>
          <button 
            onClick={handleBuyNow} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Beli Langsung
          </button>
        </div>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-bold">{product.storeName}</h2>
          <p className="text-gray-500">Online kemarin</p>
          <p>Rating: {product.storeRating} ({product.storeReviewCount})</p>
          <p>{product.processingTime}</p>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default DetailProductPage;
