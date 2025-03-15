const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initDb = () => {
  pool.connect((err) => {
    if (err) {
      console.error('Veritabanına bağlanılamadı, hata:', err.stack);
    } else {
      console.log('Veritabanı başarıyla başlatıldı ve bağlandı!');
    }
  });
};

module.exports = { pool, initDb }; // Hem pool hem de initDb dışarıya veriliyor