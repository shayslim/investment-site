const BASE_URL = ' https://investement-backend.onrender.com'; 

async function invest() {
  const coin = document.getElementById('coin').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  const priceRes = await fetch(`${BASE_URL}/api/price/${coin}`);
  const priceData = await priceRes.json();
  const price = priceData[coin].usd;

  await fetch(`${BASE_URL}/api/invest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coin, amount, priceAtInvestment: price })
  });

  loadInvestments();
}

async function loadInvestments() {
  const res = await fetch(`${BASE_URL}/api/investments`);
  const data = await res.json();
  const list = document.getElementById('investment-list');
  list.innerHTML = '';

  data.forEach(inv => {
    const li = document.createElement('li');
    li.innerText = inv.coin.toUpperCase() + ': $' + inv.amount + ' invested at $' + inv.priceAtInvestment + ' on ' + new Date(inv.date).toLocaleString();
    list.appendChild(li);
  });
}

window.onload = loadInvestments;