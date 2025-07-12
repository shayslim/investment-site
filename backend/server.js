const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let investments = [];

app.get('/api/price/:coin', async (req, res) => {
  try {
    const coin = req.params.coin;
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

app.post('/api/invest', (req, res) => {
  const { coin, amount, priceAtInvestment } = req.body;
  investments.push({ coin, amount, priceAtInvestment, date: new Date() });
  res.json({ message: 'Investment added', investments });
});

app.get('/api/investments', (req, res) => {
  res.json(investments);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});