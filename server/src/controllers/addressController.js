import Address from "../models/address_Schema.js";
import request from 'request';
import dotenv from 'dotenv';



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
    const { receiverName, phone, address, cityId, postalCode, provinceId, isDefault } = req.body; // Menggunakan provinceId
    const userId = req.user.id;
  
    try {
      if (isDefault) {
        await Address.updateMany({ userId }, { isDefault: false }); // Menonaktifkan alamat default lainnya
      }
  
      const newAddress = new Address({
        userId,
        receiverName,
        phone,
        address,
        cityId,
        postalCode,
        provinceId, // Simpan provinceId sesuai frontend
        isDefault
      });
  
      await newAddress.save();
      res.status(201).json(newAddress);
    } catch (error) {
      console.error(error.message);

      res.status(500).json({ error: error.message });
    }
  };

  export const setDefaultAddress = async (req, res) => {
    const { addressId } = req.body;
    const userId = req.user.id;
  
    try {
      // Ubah semua alamat milik user menjadi isDefault: false
      await Address.updateMany({ userId, isDefault: true }, { isDefault: false });
  
      // Ubah alamat yang dipilih menjadi isDefault: true
      await Address.findByIdAndUpdate(addressId, { isDefault: true });
  
      res.status(200).json({ message: 'Alamat default berhasil diperbarui' });
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
  


  export const provinceId = async (req, res) => {
    const provinceId = req.query.id || ''; // Optional: bisa tambahkan query untuk filter berdasarkan ID provinsi
  
    const options = {
      method: 'GET',
      url: 'https://api.rajaongkir.com/starter/province',
      headers: {
        key: process.env.RAJAONGKIR_API_KEY // Gunakan environment variable untuk API key
      },
      qs: { id: provinceId }
    };
  
    try {
      const response = await new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) reject(error);
          resolve(body);
        });
      });
  
      const result = JSON.parse(response);
      if (result.rajaongkir.status.code !== 200) {
        return res.status(result.rajaongkir.status.code).json({
          error: result.rajaongkir.status.description,
        });
      }
  
      const provinces = result.rajaongkir.results.map(province => ({
        province_id: province.province_id,
        province: province.province
      }));
  
      res.status(200).json(provinces); // Mengembalikan daftar provinsi ke client
    } catch (error) {
      res.status(500).json({
        error: "Error in request to RajaOngkir API",
        details: error.message,
      });
    }
  };
  

  export const cityId = async (req, res) => {
    const provinceId = req.query.province; // Optional: bisa tambahkan query untuk filter provinsi
  
    const options = {
      method: 'GET',
      url: 'https://api.rajaongkir.com/starter/city',
      headers: {
        key: process.env.RAJAONGKIR_API_KEY
      },
      qs: { province: provinceId || '' } // Jika ada provinceId, tambahkan ke query
    };
  
    try {
      const response = await new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) reject(error);
          resolve(body);
        });
      });
  
      const result = JSON.parse(response);
      if (result.rajaongkir.status.code !== 200) {
        return res.status(result.rajaongkir.status.code).json({
          error: result.rajaongkir.status.description,
        });
      }
  
      res.status(200).json(result.rajaongkir.results); // Mengembalikan daftar kota ke client
    } catch (error) {
      res.status(500).json({
        error: "Error in request to RajaOngkir API",
        details: error.message,
      });
    }
  };
  
  
  
  export const shipping = async (req, res) => {
    const { origin, destination, weight, courier } = req.body;
  
    const options = {
      method: 'POST',
      url: 'https://api.rajaongkir.com/starter/cost',
      headers: {
        key: process.env.RAJAONGKIR_API_KEY,
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        origin: origin,           // Kode kota asal pengiriman
        destination: destination, // Kode kota tujuan pengiriman
        weight: weight,           // Berat dalam gram
        courier: courier          // Kode kurir (misal: jne, pos, tiki)
      }
    };
  console.log(options);

    try {
      const response = await new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) reject(error);
          resolve(body);
        });
      });
  
      const result = JSON.parse(response);
      if (result.rajaongkir.status.code !== 200) {
        return res.status(result.rajaongkir.status.code).json({
          error: result.rajaongkir.status.description,
        });
      }
  
      // Mengirim kembali hasil body dari API RajaOngkir ke client
      res.status(200).json(result.rajaongkir.results);
      console.log(result.rajaongkir.results)

    } catch (error) {
      res.status(500).json({
        error: "Error in request to RajaOngkir API",
        details: error.message,
      });
    }
  };
