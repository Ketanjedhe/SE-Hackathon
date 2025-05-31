import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function StockPriceChart({ data, dateRange }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    console.log('Stock price data received:', data);

    if (!data || !data.t || data.t.length === 0) {
      console.log('No valid stock price data');
      setChartData(null);
      return;
    }

    const timestamps = data.t.map(ts => {
      const date = new Date(ts * 1000);
      return date.toLocaleString();
    });

    const closingPrices = data.c;

    console.log('Processed data:', { timestamps, closingPrices });

    setChartData({
      labels: timestamps,
      datasets: [{
        label: 'Stock Price',
        data: closingPrices,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5
      }]
    });
  }, [data, dateRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Stock Price Movement'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Price: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  if (!chartData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-lg">
        <p className="text-gray-500">No stock price data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <Line options={options} data={chartData} />
    </div>
  );
}

export default StockPriceChart;