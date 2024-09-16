import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  cityId: {
    type: String, // ID Kota dari RajaOngkir atau API sejenis
    required: true
  },
  cityName: {
    type: String, // Nama Kota yang akan tampil
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Address = mongoose.model('Address', AddressSchema);

export default Address;

