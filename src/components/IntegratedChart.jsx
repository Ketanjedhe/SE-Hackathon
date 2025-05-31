import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { format, parseISO } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function IntegratedChart({ sentimentData, stockData, dateRange }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!sentimentData || !stockData || !stockData.t) return;

    const stockTimestamps = stockData.t.map(ts => new Date(ts * 1000).toISOString());
    const allDates = [...new Set([
      ...stockTimestamps,
      ...(sentimentData?.map(item => item.publishedAt) || [])
    ])].sort();

    const labels = allDates.map(date => format(parseISO(date), 'MMM dd, HH:mm'));

    setChartData({
      labels,
      datasets: [
        {
          label: 'Stock Price',
          data: allDates.map(date => {
            const stockIndex = stockTimestamps.indexOf(date);
            return stockIndex !== -1 ? stockData.c[stockIndex] : null;
          }),
          borderColor: 'rgb(75, 192, 192)',
          yAxisID: 'y-stock',
          tension: 0.1
        },
        {
          label: 'Sentiment Score',
          data: allDates.map(date => {
            const sentiment = sentimentData?.find(item => item.publishedAt === date);
            return sentiment ? sentiment.sentiment : null;
          }),
          borderColor: 'rgb(255, 99, 132)',
          yAxisID: 'y-sentiment',
          tension: 0.1
        }
      ]
    });
  }, [sentimentData, stockData, dateRange]);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: { display: true, text: 'Stock Price vs Sentiment Analysis' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              return `${label}: ${context.parsed.y.toFixed(2)}`;
            }
            return null;
          }
        }
      }
    },
    scales: {
      'y-stock': {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Stock Price ($)' },
        grid: { drawOnChartArea: false }
      },
      'y-sentiment': {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Sentiment Score' },
        min: -1,
        max: 1,
        grid: { drawOnChartArea: false }
      }
    }
  };

  if (!chartData) {
    return <div className="text-center text-gray-500">Loading chart data...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default IntegratedChart;
