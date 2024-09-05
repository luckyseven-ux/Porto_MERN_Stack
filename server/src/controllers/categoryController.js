import Category from "../models/category_Schema.js";



export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



export const createCategory = async (req, res) => {
    try {
      const { name, description, id } = req.body;
  
      if (!name) {
        return res.status(422).json({ error: 'Name is required' });
      }
  
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(409).json({ error: 'Nama kategori sudah ada' });
      }
  
      if (!description) {
        return res.status(422).json({ error: 'Description is required' });
      }
  
      // Generate ID jika tidak disediakan
      const categoryId = id || Math.floor(Math.random() * 90000) + 10000;
      const currentDate = moment().tz('Asia/Jakarta').toDate();
      const newCategory = new Category({
        id: categoryId,
        name,
        description,
        created_date: currentDate,
        updated_date: currentDate,
      });
  
      const savedCategory = await newCategory.save();
  
      return res.status(201).json(savedCategory);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  


export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
  
      if (!name) {
        return res.status(422).json({ error: 'Nama kategori harus diisi' });
      }
  
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(404).json({ error: 'Category tidak ditemukan' });
      }
  
      // Mengecek apakah nama kategori sudah ada dan bukan milik kategori yang sedang diupdate
      const existingCategory = await Category.findOne({ name });
      if (existingCategory && existingCategory._id.toString() !== id) {
        return res.status(409).json({ error: 'Nama kategori sudah ada' });
      }
  
      category.name = name;
      const updatedCategory = await category.save();
  
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };


  export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(404).json({ error: 'Category tidak ditemukan' });
      }
  
      await Category.findByIdAndDelete(id);
  
      return res.status(200).json({ message: 'Category berhasil dihapus' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };