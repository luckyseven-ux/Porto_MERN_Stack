import Product from '../models/product_Schema.js'; // Pastikan path ke model Product benar
import Category from '../models/category_Schema.js';
import moment from 'moment-timezone';


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name') // Memuat nama kategori berdasarkan ID yang direferensikan
      .exec(); // Pastikan `exec()` dipanggil untuk mengeksekusi query

      const formattedProducts = products.map(product => {
        return {
          ...product._doc,
          created_date: new Date(product.created_date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          updated_date: new Date(product.updated_date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          category: product.category ? product.category.name : "No Category",
          image: product.image && product.image.data && product.image.contentType
            ? `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`
            : null // Jika data gambar tidak ada, berikan nilai null atau placeholder image
        };
      });
    return res.status(200).json(formattedProducts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Mencari produk berdasarkan ID
    const product = await Product.findById(id);

    // Jika produk tidak ditemukan
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Mengembalikan detail produk
    return res.status(200).json(product);
  } catch (error) {
    // Menangani kesalahan server
    return res.status(500).json({ error: error.message });
  }
};



export const postProduct = async (req, res) => {
  try {
    const { name, price, category, image, imageType } = req.body;

    // Validasi input
    if (!name) {
      return res.status(422).json({ error: 'Name perlu dimasukkan' });
    }

    if (!price) {
      return res.status(422).json({ error: 'Price perlu dimasukkan' });
    }

    if (!category) {
      return res.status(422).json({ error: 'Category id perlu dimasukkan' });
    }

    // Validasi gambar
    if (!image) {
      return res.status(422).json({ error: 'Image perlu dimasukkan' });
    }

    // Periksa apakah kategori ada
    const categoryExists = await Category.findOne({ id: category });
    console.log("Category ID yang dicari:", category);

    if (!categoryExists) {
      return res.status(422).json({ error: 'Category id tidak ditemukan!' });
    }

    const currentDate = moment().tz('Asia/Jakarta').toDate();

    // Mengonversi Base64 menjadi Buffer
    const imageBuffer = Buffer.from(image, 'base64');

    // Membuat produk baru dengan gambar yang telah dikonversi menjadi Buffer
    const newProduct = new Product({
      name,
      description: req.body.description || null,
      price,
      currency: req.body.currency || 'Rp',
      quantity: req.body.quantity || 0,
      active: req.body.active !== undefined ? req.body.active : true,
      category: category,
      image: {
        data: imageBuffer,
        contentType: imageType || null,
      },
      created_date: currentDate,
      updated_date: currentDate,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(`Product Added Successfully: ${savedProduct}`);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};




export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, currency, quantity, active, category_id } = req.body;

    // Periksa apakah produk ada
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Jika category_id diberikan, cek apakah kategori ada
    if (category_id) {
      const categoryExists = await Category.findById(category_id);
      if (!categoryExists) {
        return res.status(422).json({ error: 'Category ID tidak ditemukan!' });
      }
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.currency = currency || product.currency;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.active = active !== undefined ? active : product.active;
    product.category = category_id || product.category;
    product.updated_date = Date.now();

    // Save updated product
    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Periksa apakah produk ada
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Hapus produk
    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};