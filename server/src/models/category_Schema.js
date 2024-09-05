import mongoose from 'mongoose';

function getJakartaTime() {
  const jakartaOffset = 7 * 60 * 60 * 1000; // Offset zona waktu Jakarta dalam milidetik
  return new Date(Date.now() + jakartaOffset);
}

const categorySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: null
  },
  created_date: {
    type: Date,
    default: getJakartaTime
  },
  updated_date: {
    type: Date,
    default: getJakartaTime
  }
});



const Category = mongoose.model('Category', categorySchema);

export default Category;
