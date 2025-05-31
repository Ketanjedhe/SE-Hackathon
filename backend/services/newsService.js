import axios from 'axios';
import { subDays, subWeeks, subMonths, format } from 'date-fns';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export async function getNewsForTopic(topic, dateRange) {
    try {
        console.log('Fetching news for topic:', topic, 'with date range:', dateRange);
        
        if (!process.env.NEWS_API_KEY) {
            console.error('NEWS_API_KEY is not set in environment variables');
            throw new Error('News API key is required');
        }

        const now = new Date();
        let fromDate;
        
        // Calculate the fromDate based on dateRange
        switch (dateRange) {
            case 'yesterday':
                fromDate = new Date(now);
                fromDate.setDate(fromDate.getDate() - 1);
                break;
            case '2d':
                fromDate = new Date(now);
                fromDate.setDate(fromDate.getDate() - 2);
                break;
            case '1w':
                fromDate = new Date(now);
                fromDate.setDate(fromDate.getDate() - 7);
                break;
            default:
                fromDate = new Date(now);
                fromDate.setDate(fromDate.getDate() - 7); // Default to 1 week
        }

        console.log('Calculated fromDate:', fromDate.toISOString());

        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: topic,
                from: fromDate.toISOString(),
                to: now.toISOString(),
                language: 'en',
                sortBy: 'publishedAt',
                apiKey: process.env.NEWS_API_KEY
            },
            timeout: 10000 // 10 second timeout
        });

        console.log('News API response status:', response.status);
        console.log('Number of articles received:', response.data.articles?.length || 0);

        if (!response.data.articles) {
            console.warn('No articles in response:', response.data);
            return { articles: [] };
        }

        return {
            articles: response.data.articles.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                publishedAt: article.publishedAt,
                source: article.source
            }))
        };
    } catch (error) {
        console.error('Error in getNewsForTopic:', error);
        
        // Log detailed error information
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('News API Error Response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            throw new Error(`News API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from News API:', error.request);
            throw new Error('No response from News API. Please check your internet connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up News API request:', error.message);
            throw new Error(`Failed to fetch news: ${error.message}`);
        }
    }
}
