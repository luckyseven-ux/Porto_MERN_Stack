import React, { useState } from 'react';
import axios from 'axios';

const AddProductPage = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    quantity: '', // Stock value
    weight: '', // New weight field
    unit: 'pcs', // New unit field with default value 'pcs'
    imageBase64: '',
    imageType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setProductData({
        ...productData,
        imageBase64: base64String,
        imageType: file.type,
      });
      alert('Image uploaded successfully!');
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi gambar
    if (!productData.imageBase64 || !productData.imageType) {
      alert('Gambar produk wajib diunggah.');
      return;
    }

    const dataToSend = {
      ...productData,
      image: productData.imageBase64, // Pastikan 'imageBase64' dikirim sebagai 'image'
    };

    try {
      const response = await axios.post('http://localhost:3000/product/create', dataToSend);
      console.log('Product added:', response.data);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              rows="4"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="quantity">Stock Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="weight">Weight (in gram)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={productData.weight}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="unit">Unit</label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={productData.unit}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="e.g. pcs, kg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required={true}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {productData.imageBase64 && (
              <div className="mt-4">
                <img
                  src={`data:${productData.imageType};base64,${productData.imageBase64}`}
                  alt="Preview"
                  className="w-32 h-32 object-cover mt-2 rounded-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white w-full py-3 rounded-lg text-lg"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
