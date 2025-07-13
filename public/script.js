const BASE_URL = 'https://investement-backend.onrender.com';

// Live Chart
const ctx = document.getElementById('liveChart').getContext('2d');
let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'BTC Price',
      data: [],
      borderColor: '#0ff',
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    scales: {
      x: { display: false },
      y: {
        ticks: { color: '#fff' },
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        labels: { color: '#fff' }
      }
    }
  }
});

async function updateChart() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const price = (await res.json()).bitcoin.usd;
    const time = new Date().toLocaleTimeString();

    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(price);

    if (chart.data.labels.length > 20) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }

    chart.update();
  } catch (err) {
    console.error('Chart update failed:', err);
  }
}

// Investments
async function invest() {
  const coin = document.getElementById('coin').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (!amount || amount <= 0) {
    alert('Enter a valid amount');
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/price/${coin}`);
    const data = await res.json();
    const price = data[coin].usd;

    await fetch(`${BASE_URL}/api/invest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coin, amount, priceAtInvestment: price })
    });

    loadInvestments();
  } catch (err) {
    alert('Investment failed. Please try again.');
    console.error(err);
  }
}

async function loadInvestments() {
  try {
    const res = await fetch(`${BASE_URL}/api/investments`);
    const data = await res.json();
    const ul = document.getElementById('investment-list');
    ul.innerHTML = '';

    data.forEach(i => {
      const li = document.createElement('li');
      li.innerText = `${i.coin.toUpperCase()}: $${i.amount} @ $${i.priceAtInvestment} on ${new Date(i.date).toLocaleString()}`;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error('Failed to load investments:', err);
  }
}

// Price ticker
async function fetchPrices() {
  const coins = ['bitcoin', 'ethereum', 'solana', 'ripple', 'tether', 'binancecoin', 'dogecoin', 'tron', 'cardano', 'shiba-inu', 'chainlink'];

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd`);
    const data = await res.json();

    document.getElementById('price-ticker').innerText =
      coins.map(c => `${c.replace('-', ' ').toUpperCase()}: $${data[c]?.usd ?? 'N/A'}`).join(' | ');
  } catch (err) {
    console.error('Failed to fetch prices:', err);
    document.getElementById('price-ticker').innerText = 'Unable to load prices.';
  }
}

// Initialize
window.onload = () => {
  AOS.init();
  loadInvestments();
  fetchPrices();
  updateChart();
  setInterval(updateChart, 60000); // Update chart every 60 seconds
  setInterval(fetchPrices, 60000); // Optional: update ticker too
};
