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
import { format, parseISO } from 'date-fns';

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

function SentimentChart({ data, dateRange }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    console.log('SentimentChart received data:', { articles: data, dateRange });

    if (!data || data.length === 0) {
      setChartData(null);
      return;
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.publishedAt) - new Date(b.publishedAt)
    );

    let dateFormatString = 'MMM dd, HH:mm';
    
    setChartData({
      labels: sortedData.map(item => {
        try {
          const date = parseISO(item.publishedAt);
           return format(date, dateFormatString);
        } catch (e) {
          console.error('Error parsing or formatting date:', item.publishedAt, e);
          return 'Invalid Date'; // Handle potential parsing errors
        }
      }),
      datasets: [
        {
          label: 'Sentiment Score',
          data: sortedData.map(item => item.sentiment),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          fill: true
        }
      ]
    });
  }, [data, dateRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Sentiment Analysis Over Time'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Sentiment Score'
        },
        min: -1,
        max: 1
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  if (!chartData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-gray-500">
        {(!data || data.length === 0) ? (
            <p>No sentiment data available for the selected time period.</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <Line options={options} data={chartData} />
    </div>
  );
}

export default SentimentChart;
