import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    await onSearch(query);
    setIsSearching(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for stocks, crypto, or companies..."
          className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border-2 border-primary-200 
                   rounded-lg hover:border-primary-300 focus:border-primary-500 focus:ring-2 
                   focus:ring-primary-200 transition-all duration-300 ease-in-out shadow-sm
                   hover:shadow-md"
        />
        <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 
                          ${isSearching ? 'text-primary-500 animate-pulse' : 'text-gray-400'}`} />
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </form>
  );
}

export default SearchBar;
