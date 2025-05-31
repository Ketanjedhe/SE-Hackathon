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
                 hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                 cursor-pointer appearance-none bg-no-repeat bg-right pr-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: '1.5em'
        }}
      >
        {stocks.map(stock => (
          <option key={stock} value={stock}>{stock}</option>
        ))}
      </select>

      <select
        value={dateRange}
        onChange={handleDateRangeChange}
        className="px-4 py-2 border-2 border-primary-200 rounded-lg bg-white text-primary-600 
                 hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                 cursor-pointer appearance-none bg-no-repeat bg-right pr-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: '1.5em'
        }}
      >
        {ranges.map(range => (
          <option key={range.value} value={range.value}>{range.label}</option>
        ))}
      </select>
    </div>
  );
}

export default StockFilter;
