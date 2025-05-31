import fetch from 'node-fetch';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export async function getNewsForTopic(query) {
  const API_KEY = global.config.NEWS_API_KEY;
  
  try {
    const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
    console.log('Fetching news from:', url);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(`News API error: ${data.message}`);
    }

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from News API');
    }

    return data;
  } catch (error) {
    console.error('News API Error:', error);
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
}
