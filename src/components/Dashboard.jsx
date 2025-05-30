import { useState, useEffect } from 'react';
import SentimentChart from './SentimentChart';
import StockFilter from './StockFilter';
import NewsSection from './NewsSection';
import SearchBar from './SearchBar';
import axios from 'axios';

function Dashboard() {
  const [selectedStock, setSelectedStock] = useState('TSLA');
  const [dateRange, setDateRange] = useState('1w');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data for:', query);
      const response = await axios.get(`http://localhost:5000/api/search/${encodeURIComponent(query)}`, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setError(
        error.response ? 
          `Server error: ${error.response.data.message}` : 
          'Failed to connect to server. Please ensure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-primary-50 min-h-[calc(100vh-64px)]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-dark bg-clip-text text-transparent animate-gradient">
          Market Sentiment Analyzer
        </h1>
        <p className="text-gray-600 mt-2">Real-time sentiment analysis from Twitter and News</p>
        <div className="mt-6 flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-center mb-4">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      ) : searchResults && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-shadow">
            <StockFilter 
              selectedStock={selectedStock}
              onStockChange={setSelectedStock}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Sentiment Overview</h3>
              <div className="flex justify-around text-center">
                <div className="p-4">
                  <p className="text-green-500 text-2xl font-bold">{searchResults.metrics.positive}%</p>
                  <p className="text-sm text-gray-600">Positive</p>
                </div>
                <div className="p-4">
                  <p className="text-yellow-500 text-2xl font-bold">{searchResults.metrics.neutral}%</p>
                  <p className="text-sm text-gray-600">Neutral</p>
                </div>
                <div className="p-4">
                  <p className="text-red-500 text-2xl font-bold">{searchResults.metrics.negative}%</p>
                  <p className="text-sm text-gray-600">Negative</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Market Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-semibold">{searchResults.metrics.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tweets Analyzed</span>
                  <span className="font-semibold">{searchResults.metrics.tweetsAnalyzed}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <SentimentChart data={searchResults.articles} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <NewsSection selectedStock={selectedStock} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
