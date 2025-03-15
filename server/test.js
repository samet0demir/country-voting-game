const pool = require('./models/db');

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Bağlantı hatası:', err.stack);
  } else {
    console.log('Bağlantı başarılı! Şu anki zaman:', res.rows[0]);
  }
  pool.end();
});

console.log('Sorgu gönderildi, sonuç bekleniyor...');