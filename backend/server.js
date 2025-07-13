const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory data
let investments = [];
const users = [];

// 📈 Get crypto price from CoinGecko
app.get('/api/price/:coin', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${req.params.coin}&vs_currencies=usd`
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

// 💰 Post investment
app.post('/api/invest', (req, res) => {
  const { coin, amount, priceAtInvestment } = req.body;

  if (!coin || !amount || !priceAtInvestment) {
    return res.status(400).json({ message: 'Missing investment fields' });
  }

  const newInvestment = {
    coin,
    amount,
    priceAtInvestment,
    date: new Date(),
  };

  investments.push(newInvestment);
  res.status(201).json({ message: 'Investment added', investments });
});

// 📄 Get all investments
app.get('/api/investments', (req, res) => {
  res.json(investments);
});

// 🔐 Signup route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
});

// 🔐 Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({
    message: 'Login successful',
    user: { username: user.username, email: user.email },
  });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
