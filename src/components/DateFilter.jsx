import { useState } from 'react';

function DateFilter({ dateRange, onDateRangeChange }) {
  const ranges = [
    { value: 'yesterday', label: 'Yesterday' },
    { value: '2d', label: '2 Days' },
    { value: '1w', label: '1 Week' },
    // Removed 1 Day, 1 Month, and 3 Months
  ];

  const handleDateRangeChange = (e) => {
    onDateRangeChange(e.target.value);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="date-range" className="sr-only">Select Date Range</label>
      <select
        id="date-range"
        value={dateRange}
        onChange={handleDateRangeChange}
        className="px-4 py-2 border-2 border-primary-200 rounded-lg bg-white text-primary-600 
                 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all ml-4"
      >
        {ranges.map(range => (
          <option key={range.value} value={range.value}>{range.label}</option>
        ))}
      </select>
    </div>
  );
}

export default DateFilter; 