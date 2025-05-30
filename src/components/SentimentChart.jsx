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
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SentimentChart({ data }) {
  const chartData = {
    labels: data.map(article => new Date(article.publishedAt).toLocaleDateString()),
    datasets: [{
      label: 'Sentiment Score',
      data: data.map(article => article.sentiment),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Sentiment Trend Over Time'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Sentiment Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px]">
      <Line options={options} data={chartData} />
    </div>
  );
}

export default SentimentChart;
