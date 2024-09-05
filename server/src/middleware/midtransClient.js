import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
console.log(process.env.SERVER_KEY_MIDTRANS);

// Buat instance Snap API client
const snap = new midtransClient.Snap({
    isProduction: false, // Ganti dengan true jika menggunakan environment production
    clientKey: process.env.CLIENT_MIDTRANS, // Client Key dari Midtrans Dashboard
    serverKey: process.env.SERVER_KEY_MIDTRANS,
     // Server Key dari Midtrans Dashboard
});

// Export Snap client untuk digunakan di controller
export { snap };
