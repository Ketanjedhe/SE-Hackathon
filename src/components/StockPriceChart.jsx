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
import { format, fromUnixTime } from 'date-fns'; // Use fromUnixTime for timestamps

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StockPriceChart({ data, dateRange }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    console.log('StockPriceChart received data:', data, 'for date range:', dateRange);

    if (!data || !data.t || data.t.length === 0) {
      setChartData(null);
      return;
    }

    // Finnhub candle data structure:
    // c: [close prices]
    // h: [high prices]
    // l: [low prices]
    // o: [open prices]
    // s: status
    // t: [timestamps]
    // v: [volume]

    // Prepare data for the chart
    const timestamps = data.t.map(ts => fromUnixTime(ts)); // Convert Unix timestamps to Date objects
    const closingPrices = data.c;

    // Determine date format for labels based on dateRange
    let dateFormatString = 'MMM dd, HH:mm'; // Default
    switch (dateRange) {
        case 'yesterday':
        case '2d':
        case '1w':
            dateFormatString = 'MMM dd, HH:mm';
            break;
         // Add other cases if needed
    }

    const labels = timestamps.map(date => format(date, dateFormatString));

    console.log('StockPriceChart generated labels:', labels);
    console.log('StockPriceChart closing prices:', closingPrices);

    setChartData({
      labels,
      datasets: [{
        label: 'Closing Price',
        data: closingPrices,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
        fill: false,
        pointRadius: 1, // Smaller points for potentially dense data
        pointHoverRadius: 3
      }]
    });

  }, [data, dateRange]); // Depend on data and dateRange

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
            const label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              return `${label}: ${context.parsed.y.toFixed(2)}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price (USD)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date and Time'
        }
         // Consider using 'time' scale if necessary for better time series representation
      }
    }
  };

   if (!chartData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <p className="text-gray-500">No stock price data available for the selected time period.</p>
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