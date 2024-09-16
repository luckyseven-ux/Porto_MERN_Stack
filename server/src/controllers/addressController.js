import Address from "../models/address_Schema.js";


export const getAddress= async (req, res) => {
    const userId = req.user.id;
  
    try {
      const addresses = await Address.find({ userId });
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

export const createAddress = async (req, res) => {
    const { receiverName, phone, address, cityId, cityName, postalCode, province, isDefault } = req.body;
    const userId = req.user.id;
  
    try {
      if (isDefault) {
        await Address.updateMany({ userId }, { isDefault: false }); // Pastikan alamat baru jadi default
      }
  
      const newAddress = new Address({
        userId,
        receiverName,
        phone,
        address,
        cityId,
        cityName,
        postalCode,
        province,
        isDefault
      });
  
      await newAddress.save();
      res.status(201).json(newAddress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  export const deleteAddress = async (req, res) => {
    const addressId = req.params.addressId;
    const userId = req.user.id;
    console.log("Deleting address with ID:", req.params.addressId);  // Debugging log
    console.log("For user with ID:", req.user.id);
    try {
      const address = await Address.findOneAndDelete({ _id: addressId, userId });
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  