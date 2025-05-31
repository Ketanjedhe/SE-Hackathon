import fetch from 'node-fetch';
import { subDays, subWeeks, subMonths, format } from 'date-fns';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export async function getNewsForTopic(query, dateRange = '1w') {
  const API_KEY = global.config.NEWS_API_KEY;
  
  try {
    // Calculate the from date based on the date range
    const now = new Date();
    let fromDate;
    
    switch (dateRange) {
      case '1d':
        fromDate = subDays(now, 1);
        break;
      case '1w':
        fromDate = subWeeks(now, 1);
        break;
      case '1m':
        fromDate = subMonths(now, 1);
        break;
      case '3m':
        fromDate = subMonths(now, 3);
        break;
      default:
        fromDate = subWeeks(now, 1);
    }

    // Format the date for the API
    // News API expects dates in YYYY-MM-DD format for the 'from' and 'to' parameters
    const fromDateStr = format(fromDate, 'yyyy-MM-dd');
    const toDateStr = format(now, 'yyyy-MM-dd');

    console.log('News API date range parameters:', {
      from: fromDateStr,
      to: toDateStr,
      requestedRange: dateRange,
      calculatedFromDate: fromDate.toISOString(),
      calculatedToDate: now.toISOString()
    });

    const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&from=${fromDateStr}&to=${toDateStr}&apiKey=${API_KEY}`;
    console.log('News API request URL:', url);

    const response = await fetch(url);
    const data = await response.json();

    console.log('News API response status:', data.status);
    if (data.articles) {
        console.log('News API received articles count:', data.articles.length);
    }

    if (data.status === 'error') {
      throw new Error(`News API error: ${data.message}`);
    }

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from News API');
    }

    // The frontend Dashboard component now handles filtering by date range based on article timestamps.
    // We return all articles received from the API within the requested date parameters.
    console.log(`Returning ${data.articles.length} articles from News API fetch.`);
    
    return data;

  } catch (error) {
    console.error('News API Error:', error);
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
}
