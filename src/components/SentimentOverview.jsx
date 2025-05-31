import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function SentimentOverview({ metrics }) {
  if (!metrics || metrics.volume === 0) {
    return null; // Don't render if no data
  }

  const pieChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [metrics.positive, metrics.neutral, metrics.negative],
        backgroundColor: ['#4CAF50', '#9E9E9E', '#F44336'],
        borderColor: ['#E5E7EB', '#E5E7EB', '#E5E7EB'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow controlling size with parent container
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const percentage = ((value / metrics.volume) * 100).toFixed(0);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Sentiment Analysis Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Counts and Percentages */}
        <div className="md:col-span-2 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{metrics.positive}</div>
            <div className="text-sm text-gray-500">Positive</div>
             <div className="text-xs text-green-600 font-semibold">{((metrics.positive / metrics.volume) * 100).toFixed(0)}%</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{metrics.neutral}</div>
            <div className="text-sm text-gray-500">Neutral</div>
             <div className="text-xs text-gray-600 font-semibold">{((metrics.neutral / metrics.volume) * 100).toFixed(0)}%</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{metrics.negative}</div>
            <div className="text-sm text-gray-500">Negative</div>
             <div className="text-xs text-red-600 font-semibold">{((metrics.negative / metrics.volume) * 100).toFixed(0)}%</div>
          </div>
           <div className="md:col-span-3 text-center text-sm text-gray-500 mt-2">
               Total Articles Analyzed: <span className="font-semibold text-gray-800">{metrics.volume}</span>
           </div>
        </div>

        {/* Pie Chart */}
        <div className="md:col-span-1 flex justify-center items-center" style={{ maxHeight: '200px' }}>
          <div style={{ width: '150px', height: '150px' }}>
             <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SentimentOverview; 