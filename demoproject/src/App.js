import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './App.css';

const App = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [range, setRange] = useState('1d');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [symbol, range]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${range}&from=1572651390&to=1575243390&token=cn7g1fpr01qgjtj4jfcgcn7g1fpr01qgjtj4jfd0`);
      const result = await response.json();
      setData(result.c || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      renderChart();
    }
  }, [data]);

  const renderChart = () => {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
  
    if (data && data.length > 0) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: data.length }, (_, i) => i),
          datasets: [{
            label: 'Stock Price',
            data: data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        }
      });
    }
  };
  

  return (
    <div className="App">
      <h1>Stock Price Visualization</h1>
      <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
        <option value="AAPL">AAPL</option>
        <option value="MSFT">MSFT</option>
        <option value="GOOGL">GOOGL</option>
      </select>
      <select value={range} onChange={(e) => setRange(e.target.value)}>
        <option value="1d">1 Day</option>
        <option value="5d">5 Days</option>
        <option value="1m">1 Month</option>
      </select>
      {loading ? <p>Loading...</p> : <canvas id="myChart" width="400" height="400"></canvas>}
    </div>
  );
};

export default App;
