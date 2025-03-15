const { pool } = require('../models/db');

// Get chat messages for a specific country
exports.getCountryChat = async (req, res) => {
  const { country } = req.params;

  try {
    const messages = await pool.query(`
      SELECT c.id, c.message, c.timestamp, c.country, u.email as user_email
      FROM chats c
      JOIN users u ON c.user_id = u.id
      WHERE c.country = $1
      ORDER BY c.timestamp ASC
    `, [country]);

    res.json(messages.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get global chat messages
exports.getGlobalChat = async (req, res) => {
  try {
    const messages = await pool.query(`
      SELECT c.id, c.message, c.timestamp, c.country, u.email as user_email
      FROM chats c
      JOIN users u ON c.user_id = u.id
      WHERE c.country IS NULL
      ORDER BY c.timestamp ASC
    `);

    res.json(messages.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a chat message
exports.createChatMessage = async (req, res) => {
  const { message, country } = req.body;
  const userId = req.user.id;

  try {
    const newMessage = await pool.query(
      'INSERT INTO chats (user_id, country, message) VALUES ($1, $2, $3) RETURNING *',
      [userId, country, message]
    );

    // Get user info
    const user = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
    
    const messageWithUser = {
      ...newMessage.rows[0],
      user_email: user.rows[0].email
    };

    res.json(messageWithUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};