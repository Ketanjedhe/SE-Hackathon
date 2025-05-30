import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for stocks, crypto, or companies..."
          className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border-2 border-primary-200 
                   rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </form>
  );
}

export default SearchBar;
