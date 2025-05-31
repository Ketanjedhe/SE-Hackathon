import React from 'react';
import { FaArrowUp, FaArrowDown, FaMeh } from 'react-icons/fa';

function SentimentOverviewSection({ metrics }) {
  if (!metrics) return null;

  const getTrendColor = (sentiment) => {
    if (sentiment > 60) return 'bg-green-500';
    if (sentiment < 40) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const overallSentiment = metrics.positive > metrics.negative ? 'Bullish' : 'Bearish';
  const sentimentScore = (metrics.positive / (metrics.positive + metrics.negative) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Market Sentiment Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Sentiment Card */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall Market Sentiment</p>
              <p className="text-2xl font-bold text-primary-600">{overallSentiment}</p>
            </div>
            <div className={`rounded-full p-3 ${getTrendColor(parseFloat(sentimentScore))}`}>
              {overallSentiment === 'Bullish' ? (
                <FaArrowUp className="text-white text-xl" />
              ) : (
                <FaArrowDown className="text-white text-xl" />
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Sentiment Score</span>
              <span>{sentimentScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getTrendColor(parseFloat(sentimentScore))} rounded-full h-2`}
                style={{ width: `${sentimentScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-green-500 text-lg mb-1">
              <FaArrowUp />
            </div>
            <p className="text-2xl font-bold text-green-600">{metrics.positive}</p>
            <p className="text-sm text-gray-600">Positive</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-gray-500 text-lg mb-1">
              <FaMeh />
            </div>
            <p className="text-2xl font-bold text-gray-600">{metrics.neutral}</p>
            <p className="text-sm text-gray-600">Neutral</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-red-500 text-lg mb-1">
              <FaArrowDown />
            </div>
            <p className="text-2xl font-bold text-red-600">{metrics.negative}</p>
            <p className="text-sm text-gray-600">Negative</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SentimentOverviewSection;
