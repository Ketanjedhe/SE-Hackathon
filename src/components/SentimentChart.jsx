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
import { format, parseISO, isSameDay } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SentimentChart({ data, dateRange }) {
  const [chartData, setChartData] = useState(null);
  const [sortedChartData, setSortedChartData] = useState([]);

  useEffect(() => {
    console.log('SentimentChart received data:', data, 'for date range:', dateRange);

    if (!data || data.length === 0) {
      setChartData(null);
      setSortedChartData([]);
      return;
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.publishedAt) - new Date(b.publishedAt)
    );
    setSortedChartData(sortedData);

    // Determine date format based on dateRange
    let dateFormatString = 'MMM dd, HH:mm'; // Default format (similar to 1w)
    let tooltipDateFormatString = 'MMM dd, HH:mm:ss';

    console.log('Determining date format for range:', dateRange);

    switch (dateRange) {
      case 'yesterday':
        dateFormatString = 'HH:mm'; // Show time for Yesterday
        tooltipDateFormatString = 'MMM dd, HH:mm:ss';
        break;
      case '2d':
        dateFormatString = 'MMM dd, HH:mm'; // Show date and time for 2 Days
        tooltipDateFormatString = 'MMM dd, HH:mm:ss';
        break;
      case '1w':
        dateFormatString = 'MMM dd, HH:mm'; // Show date and time for 1 Week
        tooltipDateFormatString = 'MMM dd, HH:mm:ss';
        break;
      default:
        dateFormatString = 'MMM dd, HH:mm'; // Default to 1 week format
        tooltipDateFormatString = 'MMM dd, HH:mm:ss';
    }
    
    console.log('Using date format string:', dateFormatString);

    // Format dates for display
    const labels = sortedData.map(article => {
      try {
        const date = parseISO(article.publishedAt);
         return format(date, dateFormatString);
      } catch (e) {
        console.error('Error parsing or formatting date:', article.publishedAt, e);
        return 'Invalid Date'; // Handle potential parsing errors
      }
    });

    const sentimentScores = sortedData.map(article => article.sentiment);

    console.log('SentimentChart generated labels:', labels);
    console.log('SentimentChart sentiment scores:', sentimentScores);

    setChartData({
      labels,
      datasets: [{
        label: 'Sentiment Score',
        data: sentimentScores,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
        pointRadius: 3,
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
        text: 'Sentiment Trend Over Time'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const articleIndex = context.dataIndex;
            // Find the original article based on the data point and its timestamp
            if (!sortedChartData || sortedChartData.length <= articleIndex) {
                return `Sentiment: ${context.parsed.y.toFixed(2)}`; // Fallback if sorted data is not ready
            }
            const articleDateTimestamp = parseISO(sortedChartData[articleIndex].publishedAt).getTime();
            const originalArticle = data.find(article => 
                parseISO(article.publishedAt).getTime() === articleDateTimestamp
            );

            if (originalArticle) {
              return [
                originalArticle.title,
                `Sentiment: ${context.parsed.y.toFixed(2)}`,
                `Source: ${originalArticle.source}`,
                `Published: ${format(parseISO(originalArticle.publishedAt), tooltipDateFormatString)}`
              ];
            } else {
              return `Sentiment: ${context.parsed.y.toFixed(2)}`;
            }
          }
        }
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
        },
        // Using 'category' scale with manually formatted labels
      }
    }
  };

  if (!chartData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <p className="text-gray-500">No data available for the selected time period</p>
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
