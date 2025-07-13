const BASE_URL = 'https://investement-backend.onrender.com';

// Live Ticker Function
async function loadTicker() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,dogecoin,cardano,polygon&vs_currencies=usd');
    const data = await res.json();
    const ticker = document.getElementById('ticker-track');
    ticker.innerHTML = '';

    for (const [coin, priceObj] of Object.entries(data)) {
      const price = priceObj.usd.toFixed(2);
      const item = document.createElement('span');
      item.style.marginRight = '40px';
     item.textContent = `${coin.toUpperCase()}: $${price}`;
      ticker.appendChild(item);
    }
  } catch (error) {
    console.error('Ticker load error:', error);
  }
}
loadTicker();
setInterval(loadTicker, 60000); // update every 60 sec

// Investment Functions
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
    const price = priceData[coin].usd;

    await fetch(`${BASE_URL}/api/invest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coin, amount, priceAtInvestment: price })
    });

    loadInvestments();
  } catch (err) {
    alert('Error making investment. Please try again.');
  }
}

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
    console.log('Error loading investments', err);
  }
}

window.onload = loadInvestments;