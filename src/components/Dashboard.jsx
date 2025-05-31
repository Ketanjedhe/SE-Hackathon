import { useState, useEffect } from 'react';
import SentimentChart from './SentimentChart';
import NewsSection from './NewsSection';
import SearchBar from './SearchBar';
import axios from 'axios';
import { subDays, subWeeks, subMonths, startOfDay } from 'date-fns';
import DateFilter from './DateFilter';
import { parseISO } from 'date-fns';
import StockPriceChart from './StockPriceChart';
import CompetitorsList from './CompetitorsList';
import SentimentOverview from './SentimentOverview';
import SentimentOverviewSection from './SentimentOverviewSection';

// Common stock symbol mappings
const STOCK_SYMBOL_MAPPINGS = {
    'google': 'GOOGL',
    'alphabet': 'GOOGL',
    'apple': 'AAPL',
    'microsoft': 'MSFT',
    'amazon': 'AMZN',
    'meta': 'META',
    'facebook': 'META',
    'tesla': 'TSLA',
    'netflix': 'NFLX',
    'nvidia': 'NVDA',
    'amd': 'AMD',
    'intel': 'INTC',
    'ibm': 'IBM',
    'oracle': 'ORCL',
    'salesforce': 'CRM',
    'adobe': 'ADBE',
    'cisco': 'CSCO',
    'qualcomm': 'QCOM',
    'paypal': 'PYPL',
    'visa': 'V',
    'mastercard': 'MA',
    'disney': 'DIS',
    'starbucks': 'SBUX',
    'mcdonalds': 'MCD',
    'coca-cola': 'KO',
    'pepsi': 'PEP',
    'walmart': 'WMT',
    'target': 'TGT',
    'costco': 'COST',
    'home depot': 'HD',
    'lowes': 'LOW',
    'ford': 'F',
    'general motors': 'GM',
    'toyota': 'TM',
    'honda': 'HMC',
    'boeing': 'BA',
    'lockheed martin': 'LMT',
    'raytheon': 'RTX',
    'northrop grumman': 'NOC',
    'general electric': 'GE',
    'siemens': 'SIEGY',
    'abbott': 'ABT',
    'johnson & johnson': 'JNJ',
    'pfizer': 'PFE',
    'moderna': 'MRNA',
    'biontech': 'BNTX',
    'novavax': 'NVAX',
    'gilead': 'GILD',
    'merck': 'MRK',
    'eli lilly': 'LLY',
    'amgen': 'AMGN',
    'bristol-myers': 'BMY',
    'roche': 'RHHBY',
    'novartis': 'NVS',
    'sanofi': 'SNY',
    'astrazeneca': 'AZN',
    'glaxosmithkline': 'GSK',
    'unitedhealth': 'UNH',
    'anthem': 'ANTM',
    'cigna': 'CI',
    'humana': 'HUM',
    'centene': 'CNC',
    'molina': 'MOH',
    'wellcare': 'WCG',
    'aetna': 'AET',
    'cvs': 'CVS',
    'walgreens': 'WBA',
    'rite aid': 'RAD',
    'alibaba': 'BABA',
    'jd.com': 'JD',
    'pinduoduo': 'PDD',
    'meituan': 'MPNGF',
    'tencent': 'TCEHY',
    'baidu': 'BIDU',
    'netease': 'NTES',
    'bilibili': 'BILI'
};

// Common stock symbol typos
const STOCK_SYMBOL_TYPOS = {
    'APPL': 'AAPL',  // Common typo for Apple
    'GOOGLE': 'GOOGL',
    'GOOG': 'GOOGL',
    'MSFT': 'MSFT',
    'AMZN': 'AMZN',
    'META': 'META',
    'FB': 'META',    // Old Facebook symbol
    'TSLA': 'TSLA',
    'NFLX': 'NFLX',
    'NVDA': 'NVDA',
    'AMD': 'AMD',
    'INTC': 'INTC',
    'IBM': 'IBM',
    'ORCL': 'ORCL',
    'CRM': 'CRM',
    'ADBE': 'ADBE',
    'CSCO': 'CSCO',
    'QCOM': 'QCOM',
    'PYPL': 'PYPL',
    'V': 'V',
    'MA': 'MA',
    'DIS': 'DIS',
    'SBUX': 'SBUX',
    'MCD': 'MCD',
    'KO': 'KO',
    'PEP': 'PEP',
    'WMT': 'WMT',
    'TGT': 'TGT',
    'COST': 'COST',
    'HD': 'HD',
    'LOW': 'LOW',
    'F': 'F',
    'GM': 'GM',
    'TM': 'TM',
    'HMC': 'HMC',
    'BA': 'BA',
    'LMT': 'LMT',
    'RTX': 'RTX',
    'NOC': 'NOC',
    'GE': 'GE',
    'SIEGY': 'SIEGY',
    'ABT': 'ABT',
    'JNJ': 'JNJ',
    'PFE': 'PFE',
    'MRNA': 'MRNA',
    'BNTX': 'BNTX',
    'NVAX': 'NVAX',
    'GILD': 'GILD',
    'MRK': 'MRK',
    'LLY': 'LLY',
    'AMGN': 'AMGN',
    'BMY': 'BMY',
    'RHHBY': 'RHHBY',
    'NVS': 'NVS',
    'SNY': 'SNY',
    'AZN': 'AZN',
    'GSK': 'GSK',
    'UNH': 'UNH',
    'ANTM': 'ANTM',
    'CI': 'CI',
    'HUM': 'HUM',
    'CNC': 'CNC',
    'MOH': 'MOH',
    'WCG': 'WCG',
    'AET': 'AET',
    'CVS': 'CVS',
    'WBA': 'WBA',
    'RAD': 'RAD',
    'BABA': 'BABA',
    'JD': 'JD',
    'PDD': 'PDD',
    'MPNGF': 'MPNGF',
    'TCEHY': 'TCEHY',
    'BIDU': 'BIDU',
    'NTES': 'NTES',
    'BILI': 'BILI'
};

// Manual mapping of stock symbols to their competitors
const COMPETITOR_MAPPINGS = {
    'GOOGL': ['AAPL', 'MSFT', 'AMZN', 'META', 'NFLX'],
    'AAPL': ['MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX'],
    'MSFT': ['AAPL', 'GOOGL', 'AMZN', 'META', 'NFLX'],
    'AMZN': ['AAPL', 'GOOGL', 'MSFT', 'META', 'NFLX'],
    'TSLA': ['GM', 'F', 'TM', 'RIVN', 'LCID'],
    // Add more mappings as needed
};

function Dashboard() {
  const [dateRange, setDateRange] = useState('1w');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [competitorStocks, setCompetitorStocks] = useState([]); // NEW: state for competitor stocks
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);

  // Helper function to get the correct stock symbol
  const getStockSymbol = (query) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // First check if it's a company name
    if (STOCK_SYMBOL_MAPPINGS[normalizedQuery]) {
      return STOCK_SYMBOL_MAPPINGS[normalizedQuery];
    }
    
    // Then check if it's a common typo
    const upperQuery = query.toUpperCase();
    if (STOCK_SYMBOL_TYPOS[upperQuery]) {
      console.log(`Corrected stock symbol from ${upperQuery} to ${STOCK_SYMBOL_TYPOS[upperQuery]}`);
      return STOCK_SYMBOL_TYPOS[upperQuery];
    }
    
    // If not found in mappings, return the uppercase version
    return upperQuery;
  };

  const getFilteredArticles = (articles) => {
    if (!articles) return [];
    
    const now = new Date();
    let startDate;
    
    console.log('Filtering articles for date range:', dateRange);
    console.log('Current time for filtering:', now.toISOString());

    switch (dateRange) {
      case 'yesterday':
        // Start of yesterday
        startDate = startOfDay(subDays(now, 1));
        console.log('Calculated start date (yesterday):', startDate.toISOString());
        break;
      case '2d':
        // Start of the day before yesterday
        startDate = startOfDay(subDays(now, 2));
        console.log('Calculated start date (2d):', startDate.toISOString());
        break;
      case '1w':
        // Start of one week ago
        startDate = subWeeks(now, 1);
        console.log('Calculated start date (1w):', startDate.toISOString());
        break;
      default:
        // Default to 1 week if dateRange is unexpected
        startDate = subWeeks(now, 1);
        console.log('Calculated start date (default - 1w):', startDate.toISOString());
    }

    const filtered = articles.filter(article => {
      try {
        const articleDate = parseISO(article.publishedAt);
        // Ensure both start and end times are included in the comparison
        const isWithinRange = articleDate >= startDate && articleDate <= now;
        // console.log(`Article: ${article.title}, Date: ${articleDate.toISOString()}, Within range (${dateRange}) ${startDate.toISOString()} to ${now.toISOString()}? ${isWithinRange}`);
        return isWithinRange;
      } catch (e) {
        console.error('Error parsing article date:', article.publishedAt, e);
        return false; // Exclude articles with invalid dates
      }
    });
    
    console.log(`Finished filtering. Found ${filtered.length} articles within the ${dateRange} range.`);

    return filtered;
  };

// Add new utility function at the top of the file
const checkServerStatus = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    return response.data.status === 'ok';
  } catch (error) {
    return false;
  }
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    
    if (!query) {
        setSearchResults(null);
        setSearchQuery('');
        return;
    }

    // Check server status first
    const isServerRunning = await checkServerStatus();
    if (!isServerRunning) {
        setError('Server is not responding. Please ensure the backend server is running.');
        setLoading(false);
        return;
    }

    let retries = 0;
    const attemptSearch = async () => {
      try {
        const stockSymbol = getStockSymbol(query);
        const competitorSymbols = COMPETITOR_MAPPINGS[stockSymbol] ? COMPETITOR_MAPPINGS[stockSymbol].join(',') : '';

        const response = await axios.get(
          `http://localhost:5000/api/search/${encodeURIComponent(stockSymbol)}`,
          {
            params: { dateRange, competitorSymbols },
            timeout: 10000,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        setSearchResults(response.data);
        setSearchQuery(stockSymbol);
      } catch (error) {
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(`Retry attempt ${retries} of ${MAX_RETRIES}`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return attemptSearch();
        }
        
        let errorMessage = 'An error occurred while fetching data.';
        
        if (error.response) {
          errorMessage = `Server error: ${error.response.data.message || 'Unknown error'}`;
        } else if (error.request) {
          errorMessage = 'No response from server. Please check if the backend is running.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.';
        }
        
        throw new Error(errorMessage);
      }
    };

    try {
      await attemptSearch();
    } catch (error) {
      console.error('Search error after retries:', error);
      setError(error.message);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Date range changed to:', dateRange, 'or searchQuery changed to:', searchQuery);
    if (searchQuery) {
       handleSearch(searchQuery);
    } else if (dateRange !== '1w' && !searchQuery) {
        setSearchResults(null);
    }
  }, [dateRange, searchQuery]);

  const getFilteredMetrics = () => {
    if (!searchResults) return null;
    
    const filteredArticles = getFilteredArticles(searchResults.articles);
    const total = filteredArticles.length;
    
    const positivePercentage = total > 0 ? Math.round((filteredArticles.filter(a => a.sentiment > 0).length / total) * 100) : 0;
    const neutralPercentage = total > 0 ? Math.round((filteredArticles.filter(a => a.sentiment === 0).length / total) * 100) : 0;
    const negativePercentage = total > 0 ? Math.round((filteredArticles.filter(a => a.sentiment < 0).length / total) * 100) : 0;

    return {
      positive: positivePercentage,
      neutral: neutralPercentage,
      negative: negativePercentage,
      volume: searchResults.metrics?.volume || 0,
      tweetsAnalyzed: searchResults.metrics?.tweetsAnalyzed || 0
    };
  };

  const filteredMetrics = getFilteredMetrics();

  // Helper to format stock price change
  const formatStockChange = (change, percentChange) => {
      if (change === undefined || percentChange === undefined) return '--';
      const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
      const sign = change > 0 ? '+' : '';
      return (
          <span className={changeColor}>
              {`${sign}${change.toFixed(2)} (${sign}${percentChange.toFixed(2)}%)`}
          </span>
      );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-start via-background-middle to-background-end animate-gradient-move">
        {/* Animated Overlay */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-tr from-background-accent1/30 to-background-accent2/30 animate-background-shine" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] animate-pulse-soft" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-white mb-4 drop-shadow-lg">
              Market Analytics Hub
            </h1>
            <p className="text-gray-200 text-lg mb-8">
              Real-time Market Intelligence & Sentiment Analysis
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SearchBar onSearch={handleSearch} />
              <DateFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
            </div>
          </div>

          {/* Error Display - Update styling for better contrast */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-900/80 border-l-4 border-red-500 p-4 rounded-xl backdrop-blur-sm text-white">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">⚠️</div>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State - Update styling */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 
                            rounded-full animate-spin mb-4" />
              <p className="text-white animate-pulse">Processing market data...</p>
            </div>
          ) : searchResults && (
            <div className="space-y-8 animate-fade-in">
              {/* Sentiment Overview Section */}
              {filteredMetrics && <SentimentOverviewSection metrics={filteredMetrics} />}
              
              {/* Competitor Stocks Section */}
              {searchResults.competitorQuotes && Object.keys(searchResults.competitorQuotes).length > 0 && (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Market Competitors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(searchResults.competitorQuotes).map(([symbol, quote]) => (
                      <div key={symbol} 
                           className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-lg font-bold text-gray-900">{symbol}</span>
                          <span className={`text-sm font-semibold ${
                            quote.dp > 0 ? 'text-green-500' : quote.dp < 0 ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            {quote.dp > 0 ? '↑' : quote.dp < 0 ? '↓' : '•'}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-primary-600 mb-2">
                          ${quote.c.toFixed(2)}
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Change</span>
                          <span className={quote.d > 0 ? 'text-green-500' : quote.d < 0 ? 'text-red-500' : 'text-gray-500'}>
                            {quote.d > 0 ? '+' : ''}{quote.d.toFixed(2)} ({quote.dp.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Charts Section - Modified to show only Sentiment */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl 
                              transition-shadow duration-300 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Market Sentiment</h3>
                    <SentimentChart 
                      data={getFilteredArticles(searchResults.articles)} 
                      dateRange={dateRange} 
                    />
                  </div>
                </div>
              </div>

              {/* News Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-up">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Latest Market News</h3>
                <NewsSection selectedStock={searchQuery} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// New MetricCard component
function MetricCard({ title, value, trend, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-sm font-medium ${
            trend === 'positive' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend === 'positive' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mt-4">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}

export default Dashboard;
