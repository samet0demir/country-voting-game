const { pool } = require('../models/db');

// Get all countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await pool.query('SELECT * FROM countries ORDER BY votes_count DESC');
    console.log(`Tüm ülkeler alındı: ${countries.rows.length} ülke`);
    res.json(countries.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Vote for a country
exports.voteForCountry = async (req, res) => {
  const { country } = req.body;
  const userId = req.user.id;

  try {
    // If country is null, this is just a check to see if user has voted today
    if (country === null) {
      return res.status(400).json({ msg: 'Please select a country to vote' });
    }

    // Check if user has already voted today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND vote_date >= $2 AND vote_date < $3',
      [userId, today, tomorrow]
    );

    if (existingVote.rows.length > 0) {
      return res.status(400).json({ msg: 'You have already voted today' });
    }

    console.log(`Oy kaydediliyor: Kullanıcı ${userId}, Ülke: "${country}"`);

    // Create vote record
    await pool.query(
      'INSERT INTO votes (user_id, country) VALUES ($1, $2)',
      [userId, country]
    );

    // Update country votes count
    await pool.query(
      'INSERT INTO countries (name, votes_count) VALUES ($1, 1) ON CONFLICT (name) DO UPDATE SET votes_count = countries.votes_count + 1',
      [country]
    );

    console.log(`Oy başarıyla kaydedildi: Ülke "${country}"`);

    // Broadcast vote update via WebSocket
    const broadcastVoteUpdate = req.app.get('broadcastVoteUpdate');
    if (broadcastVoteUpdate) {
      console.log('WebSocket üzerinden oy güncellemesi yayınlanıyor...');
      await broadcastVoteUpdate();
    } else {
      console.warn('broadcastVoteUpdate fonksiyonu bulunamadı!');
    }

    res.json({ msg: 'Vote recorded successfully' });
  } catch (err) {
    console.error(`Oy kaydedilirken hata: ${err.message}`);
    res.status(500).send('Server error');
  }
};

// Get voting statistics
exports.getVotingStats = async (req, res) => {
  try {
    const stats = await pool.query('SELECT name, votes_count FROM countries ORDER BY votes_count DESC');
    
    // Oy sayısına göre sıralama
    const sortedStats = stats.rows.sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0));
    
    console.log(`Oy istatistikleri alındı: ${sortedStats.length} ülke`);
    console.log(`En çok oy alan ülkeler:`, sortedStats.slice(0, 3).map(c => `${c.name}: ${c.votes_count || 0}`));
    
    res.json(sortedStats);
  } catch (err) {
    console.error(`Oy istatistiklerini alırken hata: ${err.message}`);
    res.status(500).send('Server error');
  }
};

// Check if user has voted today
exports.checkVoted = async (req, res) => {
  // If no user is logged in, return false
  if (!req.user) {
    return res.json({ hasVoted: false });
  }

  try {
    const userId = req.user.id;
    
    // Check if user has already voted today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND vote_date >= $2 AND vote_date < $3',
      [userId, today, tomorrow]
    );

    const hasVoted = existingVote.rows.length > 0;
    const votedCountry = hasVoted ? existingVote.rows[0].country : null;
    
    console.log(`Kullanıcı ${userId} için oy kontrolü: ${hasVoted ? `Oy kullanmış (${votedCountry})` : 'Henüz oy kullanmamış'}`);
    
    res.json({ 
      hasVoted: hasVoted,
      votedCountry: votedCountry
    });
  } catch (err) {
    console.error(`Oy kontrolü sırasında hata: ${err.message}`);
    res.status(500).send('Server error');
  }
};