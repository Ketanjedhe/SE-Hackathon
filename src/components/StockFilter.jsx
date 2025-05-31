function StockFilter({ selectedStock, onStockChange, dateRange, onDateRangeChange }) {
  const stocks = ['TSLA', 'AAPL', 'GOOGL', 'BTC', 'ETH'];
  const ranges = [
    { value: '1d', label: '1 Day' },
    { value: '1w', label: '1 Week' },
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' }
  ];

  const handleDateRangeChange = (e) => {
    console.log('Date range changed in StockFilter:', e.target.value);
    onDateRangeChange(e.target.value);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
      <select
        value={selectedStock}
        onChange={(e) => onStockChange(e.target.value)}
        className="px-4 py-2 border-2 border-primary-200 rounded-lg bg-white text-primary-600 
                 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
      >
        {stocks.map(stock => (
          <option key={stock} value={stock}>{stock}</option>
        ))}
      </select>

      <select
        value={dateRange}
        onChange={handleDateRangeChange}
        className="px-4 py-2 border-2 border-primary-200 rounded-lg bg-white text-primary-600 
                 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
      >
        {ranges.map(range => (
          <option key={range.value} value={range.value}>{range.label}</option>
        ))}
      </select>
    </div>
  );
}

export default StockFilter;
