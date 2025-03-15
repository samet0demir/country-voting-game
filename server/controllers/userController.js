const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../models/db');

// Register user
exports.register = async (req, res) => {
  const { email, password, age, gender, country, nickname } = req.body;

  try {
    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // If nickname is not provided, extract it from email
    const userNickname = nickname || email.substring(0, email.indexOf('@'));

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (email, password, age, gender, country, nickname) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [email, hashedPassword, age, gender, country, userNickname]
    );

    // Create JWT
    const payload = {
      user: {
        id: newUser.rows[0].id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT
    const payload = {
      user: {
        id: user.rows[0].id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await pool.query('SELECT id, email, nickname, age, gender, country FROM users WHERE id = $1', [req.user.id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { nickname, country } = req.body;

  try {
    // Verify user exists and get current info
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const user = userResult.rows[0];
    
    // Check if user is changing their country
    if (country !== user.country) {
      // Check if last country change was within 1 week
      if (user.last_country_change) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const lastChangeDate = new Date(user.last_country_change);
        
        if (lastChangeDate > oneWeekAgo) {
          // Calculate days left until can change again
          const daysLeft = 7 - Math.floor((new Date() - lastChangeDate) / (1000 * 60 * 60 * 24));
          return res.status(400).json({ 
            msg: `Ülkenizi sadece 7 günde bir değiştirebilirsiniz. ${daysLeft} gün daha beklemelisiniz.` 
          });
        }
        
        // Update user with new country and update last_country_change timestamp
        const updatedUser = await pool.query(
          'UPDATE users SET nickname = $1, country = $2, last_country_change = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, nickname, age, gender, country, last_country_change',
          [nickname, country, req.user.id]
        );
        
        return res.json(updatedUser.rows[0]);
      } else {
        // First country change, update user with last_country_change
        const updatedUser = await pool.query(
          'UPDATE users SET nickname = $1, country = $2, last_country_change = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, nickname, age, gender, country, last_country_change',
          [nickname, country, req.user.id]
        );
        
        return res.json(updatedUser.rows[0]);
      }
    } else {
      // Only nickname is being updated, no country change
      const updatedUser = await pool.query(
        'UPDATE users SET nickname = $1 WHERE id = $2 RETURNING id, email, nickname, age, gender, country, last_country_change',
        [nickname, req.user.id]
      );
      
      return res.json(updatedUser.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};