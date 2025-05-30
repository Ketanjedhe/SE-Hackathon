import { FaChartLine } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-primary-500 to-accent-dark p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaChartLine className="text-white text-2xl animate-float" />
          <span className="text-white text-xl font-bold">Market Sentiment</span>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all">
            Dashboard
          </button>
          <button className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all">
            Analytics
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
