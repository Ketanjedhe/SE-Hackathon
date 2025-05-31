import React from 'react';

function CompetitorsList({ stockSymbol, competitorQuotes }) {
  // Placeholder data for now
  const competitorData = [
    { symbol: 'MSFT', price: 'Loading...', change: 'Loading...' },
    { symbol: 'AAPL', price: 'Loading...', change: 'Loading...' },
    { symbol: 'AMZN', price: 'Loading...', change: 'Loading...' },
  ];

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
    <div className="bg-white rounded-xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-shadow">
      <h4 className="text-lg font-semibold text-gray-700 mb-4">Competitor Stocks ({stockSymbol})</h4>
      {competitorQuotes && Object.keys(competitorQuotes).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(competitorQuotes).map(([symbol, quote]) => (
              <div key={symbol} className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{symbol}</span>
                <span className="text-gray-700">{quote.c.toFixed(2)}</span>
                <span className="text-sm text-gray-500">{formatStockChange(quote.d, quote.dp)}</span>
              </div>
            ))}
          </div>
      ) : (
          <p className="text-gray-500">Competitor data loading or not available.</p>
      )}
    </div>
  );
}

export default CompetitorsList; 