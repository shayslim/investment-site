const BASE_URL = 'https://investement-backend.onrender.com';

// Submit investment
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
      alert('Price data not available.');
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

// Load investment history
async function loadInvestments() {
  try {
    const res = await fetch(`${BASE_URL}/api/investments`);
    const data = await res.json();
    const list = document.getElementById('investment-list');

    list.innerHTML = ''; // Clear existing items

    data.forEach(inv => {
      const li = document.createElement('li');
      li.textContent = `${inv.coin.toUpperCase()}: $${inv.amount} @ $${inv.priceAtInvestment} on ${new Date(inv.date).toLocaleString()}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error loading investments:', err);
  }
}

// Load current prices for ticker
async function loadPrices() {
  const coins = ['bitcoin', 'ethereum', 'bnb', 'xrp', 'tether', 'dogecoin', 'cardano', 'tron', 'shiba', 'chainlink'];
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd`);
    const data = await res.json();
    const ticker = document.getElementById('price-ticker');

    ticker.innerHTML = coins
      .map(c => `${c.toUpperCase()}: $${data[c]?.usd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}`)
      .join(' | ');
  } catch (err) {
    console.error('Error loading prices:', err);
    document.getElementById('price-ticker').textContent = 'Error loading prices.';
  }
}

// Initialize on load
window.onload = () => {
  loadInvestments();
  loadPrices();
};
