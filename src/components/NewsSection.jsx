import { useState, useEffect } from 'react';
import axios from 'axios';

function NewsSection({ selectedStock }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/news/search/${selectedStock}`);
        setNews(response.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedStock]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Latest News</h3>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {news.map((item, index) => (
            <div key={index} className="border-b last:border-b-0 pb-4">
              <a href={item.url} target="_blank" rel="noopener noreferrer" 
                 className="text-primary-600 hover:text-primary-800 font-medium">
                {item.title}
              </a>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{item.source}</span>
                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsSection;
