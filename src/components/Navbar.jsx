import { FaChartLine } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaChartLine className="text-white text-2xl animate-float" />
            <span className="text-white text-xl font-bold tracking-wide">Market Sentiment</span>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 ease-in-out
                           focus:outline-none focus:ring-2 focus:ring-white/50 active:bg-white/30">
              Dashboard
            </button>
            <button className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 ease-in-out
                           focus:outline-none focus:ring-2 focus:ring-white/50 active:bg-white/30">
              Analytics
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
