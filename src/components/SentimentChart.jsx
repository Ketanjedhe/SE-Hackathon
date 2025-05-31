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
import { format, parseISO, isSameDay } from 'date-fns';

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

function SentimentChart({ data, dateRange, stockCandles }) {
  const [chartData, setChartData] = useState(null);
  const [sortedChartData, setSortedChartData] = useState([]);

  useEffect(() => {
    console.log('SentimentChart received data:', { articles: data, dateRange, stockCandles });

    if (!data || data.length === 0 && (!stockCandles || !stockCandles.c || stockCandles.c.length === 0)) {
      setChartData(null);
      setSortedChartData([]);
      return;
    }

    // Combine and sort data by date
    const combinedData = [];
    if (data && data.length > 0) {
      combinedData.push(...data.map(item => ({ ...item, type: 'sentiment' })));
    }
    if (stockCandles && stockCandles.c && stockCandles.c.length > 0) {
        // Map Twelve Data format (arrays) to objects for easier sorting and access
        const mappedCandles = stockCandles.t.map((timestamp, index) => ({
            publishedAt: new Date(timestamp * 1000).toISOString(), // Convert Unix timestamp to ISO string
            close: stockCandles.c[index],
            open: stockCandles.o?.[index],
            high: stockCandles.h?.[index],
            low: stockCandles.l?.[index],
            volume: stockCandles.v?.[index],
            type: 'stock'
        }));
      combinedData.push(...mappedCandles);
    }

    // Sort combined data by date
    const sortedData = [...combinedData].sort((a, b) => 
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
          data: sortedData.map(item => item.type === 'sentiment' ? item.sentiment : null),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)', // Add background color for area fill
          tension: 0.1,
          fill: 'start', // Fill area under the line
          pointRadius: 3,
          pointHoverRadius: 5,
          yAxisID: 'y-sentiment' // Assign to primary y-axis
        },
        {
          label: 'Stock Price',
          data: sortedData.map(item => item.type === 'stock' ? item.close : null),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)', // Add background color for area fill
          tension: 0.1,
          fill: 'start', // Fill area under the line
          pointRadius: 3,
          pointHoverRadius: 5,
          yAxisID: 'y-price' // Assign to secondary y-axis
        }
      ]
    });
  }, [data, dateRange, stockCandles]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Sentiment and Stock Price Trend Over Time'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const item = sortedChartData[context.dataIndex];

            if (item.type === 'sentiment') {
                return [
                    item.title || 'Sentiment Data',
                    `Sentiment: ${item.sentiment.toFixed(2)}`,
                    item.source ? `Source: ${item.source}` : '',
                    `Published: ${format(parseISO(item.publishedAt), tooltipDateFormatString)}`
                ].filter(line => line);
            } else if (item.type === 'stock') {
                 return [
                     'Stock Price Data',
                     `Close: ${item.close.toFixed(2)}`,
                     item.open !== undefined ? `Open: ${item.open.toFixed(2)}` : '',
                     item.high !== undefined ? `High: ${item.high.toFixed(2)}` : '',
                     item.low !== undefined ? `Low: ${item.low.toFixed(2)}` : '',
                     item.volume !== undefined ? `Volume: ${item.volume}` : '',
                     `Timestamp: ${format(parseISO(item.publishedAt), tooltipDateFormatString)}`
                 ].filter(line => line);
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Sentiment Score'
        },
        min: -1,
        max: 1,
        position: 'left',
        id: 'y-sentiment'
      },
      'y-price': {
        type: 'linear',
        title: {
          display: true,
          text: 'Stock Price'
        },
        position: 'right',
        id: 'y-price',
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        },
      }
    }
  };

  if (!chartData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-gray-500">
        {(!data || data.length === 0) && (!stockCandles || !stockCandles.c || stockCandles.c.length === 0) ? (
            <p>No sentiment or stock price data available for the selected time period.</p>
        ) : (!data || data.length === 0) ? (
             <p>No sentiment data available for the selected time period, but stock price data is available.</p>
        ) : (!stockCandles || !stockCandles.c || stockCandles.c.length === 0) ? (
             <p>No stock price data available for the selected time period, but sentiment data is available.</p>
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
