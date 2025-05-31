import { useState, useEffect } from 'react';
import SentimentChart from './SentimentChart';
import NewsSection from './NewsSection';
import SearchBar from './SearchBar';
import axios from 'axios';
import { subDays, subWeeks, subMonths, startOfDay } from 'date-fns';
import DateFilter from './DateFilter';
import { parseISO } from 'date-fns';
import StockPriceChart from './StockPriceChart';

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

const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setCompetitorStocks([]); // Clear previous competitors

    if (!query) {
      setSearchResults(null);
      setSearchQuery('');
      return;
    }

    try {
      const stockSymbol = getStockSymbol(query);
      console.log('Searching for stock symbol:', stockSymbol);

      const response = await axios.get(`http://localhost:5000/api/search/${encodeURIComponent(stockSymbol)}`, {
        params: {
          dateRange: dateRange
        },
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      setSearchResults(response.data);
      setSearchQuery(stockSymbol);

      // --- Fetch competitors ---
      setLoadingCompetitors(true);
      try {
        const compRes = await axios.get(`http://localhost:5000/api/competitors/${stockSymbol}`);
        const competitors = compRes.data.competitors || [];
        // Fetch stock quotes for each competitor
        const competitorQuotes = await Promise.all(
          competitors.map(async (symbol) => {
            try {
              const quoteRes = await axios.get(`http://localhost:5000/api/search/${symbol}`);
              return {
                symbol,
                stockQuote: quoteRes.data.stockQuote
              };
            } catch (e) {
              return { symbol, stockQuote: null };
            }
          })
        );
        setCompetitorStocks(competitorQuotes);
      } catch (e) {
        setCompetitorStocks([]);
      } finally {
        setLoadingCompetitors(false);
      }
      // --- End competitors fetch ---

    } catch (error) {
      // ...existing error handling...
      let errorMessage = 'Failed to connect to server. Please ensure the backend is running.';

      if (error.response) {
        const errorData = error.response.data;
        errorMessage = `Server error: ${errorData.error || errorData.message || 'Unknown error'}`;
        if (errorData.details) {
          console.error('Error details:', errorData.details);
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if the backend is running.';
      }

      setError(errorMessage);
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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-primary-50 min-h-[calc(100vh-64px)]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-dark bg-clip-text text-transparent animate-gradient">
          Market Sentiment Analyzer
        </h1>
        <p className="text-gray-600 mt-2">Real-time sentiment analysis from Twitter and News</p>
        <div className="mt-6 flex justify-center items-center">
          <SearchBar onSearch={handleSearch} />
          <DateFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-center mb-4 p-4 bg-red-50 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      ) : searchResults && (
        <div className="max-w-7xl mx-auto">
          {/* Stock Price Overview */}
          {searchResults.stockQuote && (
             <div className="bg-white rounded-xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Stock Overview</h3>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-2xl font-bold text-gray-800 mr-2">{searchQuery}</span>
                         <span className="text-3xl font-bold text-primary-600">{searchResults.stockQuote.c.toFixed(2)}</span> {/* Current Price */}
                    </div>
                    <div>
                        {formatStockChange(searchResults.stockQuote.d, searchResults.stockQuote.dp)} {/* Change and Percentage Change */}
                    </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Open: {searchResults.stockQuote.o.toFixed(2)}</span>
                    <span>High: {searchResults.stockQuote.h.toFixed(2)}</span>
                    <span>Low: {searchResults.stockQuote.l.toFixed(2)}</span>
                    <span>Previous Close: {searchResults.stockQuote.pc.toFixed(2)}</span>
                </div>
             </div>
          )}

                    {/* --- Competitor Stocks Section --- */}
          <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Competitor Stock Prices</h3>
            {loadingCompetitors ? (
              <div>Loading competitor stocks...</div>
            ) : competitorStocks.length === 0 ? (
              <div className="text-gray-500">No competitor data available.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {competitorStocks.map((comp) => (
                  <div key={comp.symbol} className="border rounded-lg p-4 flex flex-col items-center bg-gray-50">
                    <span className="font-bold text-primary-600 text-lg">{comp.symbol}</span>
                    {comp.stockQuote ? (
                      <>
                        <span className="text-2xl font-bold">{comp.stockQuote.c.toFixed(2)}</span>
                        <span className={
                          comp.stockQuote.d > 0
                            ? 'text-green-600'
                            : comp.stockQuote.d < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }>
                          {comp.stockQuote.d > 0 ? '+' : ''}
                          {comp.stockQuote.d?.toFixed(2)} ({comp.stockQuote.dp > 0 ? '+' : ''}{comp.stockQuote.dp?.toFixed(2)}%)
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">No data</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* --- End Competitor Stocks Section --- */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <StockPriceChart data={searchResults.stockCandles} dateRange={dateRange} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <SentimentChart data={getFilteredArticles(searchResults.articles)} dateRange={dateRange} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mb-6">
            <div className="lg:col-span-3">
              <NewsSection selectedStock={searchQuery} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
