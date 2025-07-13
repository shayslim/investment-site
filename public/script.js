const BASE_URL = 'https://investement-backend.onrender.com';

// 🔄 Fetch Prices from CoinGecko
async function fetchPrices() {
  const coins = ['bitcoin', 'ethereum', 'bnb', 'xrp', 'tether', 'dogecoin', 'cardano', 'tron', 'shiba', 'chainlink'];
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd`);
    const data = await res.json();

    const ticker = document.getElementById('price-ticker');
    ticker.innerText = coins
      .map(c => `${c.toUpperCase()}: $${data[c]?.usd?.toFixed(2) || 'N/A'}`)
      .join(' | ');
  } catch (err) {
    document.getElementById('price-ticker').innerText = 'Error loading prices.';
    console.error('Price fetch error:', err);
  }
}

// 💰 Invest Handler
async function invest() {
  const coin = document.getElementById('coin').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (!amount || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  try {
    const priceRes = await fetch(`${BASE_URL}/api/price/${coin}`);
    const priceData = await priceRes.json();
    const price = priceData[coin]?.usd;

    if (!price) {
      alert('Failed to fetch coin price.');
      return;
    }

    await fetch(`${BASE_URL}/api/invest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coin, amount, priceAtInvestment: price })
    });

    loadInvestments();
  } catch (err) {
    console.error('Investment error:', err);
    alert('Error making investment. Please try again.');
  }
}

// 📊 Load Investment History
async function loadInvestments() {
  try {
    const res = await fetch(`${BASE_URL}/api/investments`);
    const data = await res.json();
    const list = document.getElementById('investment-list');
    list.innerHTML = '';

    data.forEach(inv => {
      const li = document.createElement('li');
      li.innerText = `${inv.coin.toUpperCase()}: $${inv.amount} @ $${inv.priceAtInvestment} on ${new Date(inv.date).toLocaleString()}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error loading investments:', err);
  }
}

// 🚀 Init
window.onload = () => {
  loadInvestments();
  fetchPrices();
};
