const BASE_URL = 'https://investement-backend.onrender.com';



async function fetchPrices() {

  const coins = ['bitcoin', 'ethereum', 'solana', 'ripple', 'tether', 'binancecoin', 'dogecoin', 'tron', 'cardano', 'shiba-inu', 'chainlink'];

  try {

    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd`);

    const data = await res.json();

    const ticker = document.getElementById('price-ticker');

    ticker.innerHTML = coins.map(coin => {

      const price = data[coin]?.usd ?? 'N/A';

      return `<span>${coin.toUpperCase()}: $${price}</span>`;

    }).join(' | ');

  } catch (err) {

    console.error('Error loading prices:', err);

    document.getElementById('price-ticker').innerText = 'Error loading prices';

  }

}



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



window.onload = () => {

  fetchPrices();

  loadInvestments();

};