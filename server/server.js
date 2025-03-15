const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, initDb } = require('./models/db'); // db.js’den pool ve initDb’i al

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize database (hata kontrolüyle)
try {
  initDb(); // Veritabanını başlat
} catch (error) {
  console.error('Veritabanı başlatılırken hata oluştu:', error);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/countries', require('./routes/countries'));
app.use('/api/chats', require('./routes/chats'));

// Socket.io setup
io.on('connection', (socket) => {
  console.log('Yeni bir müşteri bağlandı!');
  
  // Ülke sohbet odasına katıl
  socket.on('joinCountryRoom', (country) => {
    socket.join(country);
    console.log(`Müşteri ${country} odasına katıldı`);
  });
  
  // Ülke sohbet odasından çık
  socket.on('leaveCountryRoom', (country) => {
    socket.leave(country);
    console.log(`Müşteri ${country} odasından çıktı`);
  });
  
  // Genel sohbet odasına katıl
  socket.on('joinGlobalRoom', () => {
    socket.join('global');
    console.log('Müşteri genel odaya katıldı');
  });
  
  // Genel sohbet odasından çık
  socket.on('leaveGlobalRoom', () => {
    socket.leave('global');
    console.log('Müşteri genel odadan çıktı');
  });
  
  // Ülke sohbetine mesaj gönder
  socket.on('countryMessage', (data) => {
    io.to(data.country).emit('countryMessage', data);
  });
  
  // Genel sohbet odasına mesaj gönder
  socket.on('globalMessage', (data) => {
    io.to('global').emit('globalMessage', data);
  });
  
  // Bağlantı kesildi
  socket.on('disconnect', () => {
    console.log('Müşteri ayrıldı');
  });
});

// Server'ı başlat
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Mutfak ${PORT} numaralı kapıda açıldı!`);
});