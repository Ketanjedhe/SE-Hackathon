import express from 'express';
import natural from 'natural';
import { getNewsForTopic } from '../services/newsService.js';
import { getStockQuote, getStockCandles } from '../services/stockService.js';

const router = express.Router();
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");

router.get('/:query', async (req, res) => {
  const { query } = req.params;
  const { dateRange } = req.query;

  console.log('Search request received:', {
    query,
    dateRange,
    queryParams: req.query
  });

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }

  try {
    console.log(`Processing search for: ${query} with date range: ${dateRange}`);
    
    // Fetch news data (can be done in parallel)
    const newsDataPromise = getNewsForTopic(query, dateRange);

    // Fetch stock quote and candles data from Finnhub (can be done in parallel)
    const stockSymbol = query.toUpperCase(); // Use uppercase symbol for Finnhub
    console.log('Fetching stock data for symbol:', stockSymbol);
    
    const stockQuotePromise = getStockQuote(stockSymbol).catch(error => {
      console.error('Error fetching stock quote:', error);
      return { success: false, error: error.message };
    });

    const stockCandlesPromise = getStockCandles(stockSymbol, dateRange).catch(error => {
      console.error('Error fetching stock candles:', error);
      return { success: false, error: error.message };
    });

    // Wait for all promises to resolve
    const [newsData, stockQuoteResult, stockCandlesResult] = await Promise.all([
        newsDataPromise,
        stockQuotePromise,
        stockCandlesPromise
    ]);

    console.log(`Received ${newsData.articles.length} articles from News API`);

    let stockQuote = null;
    if (stockQuoteResult.success) {
        stockQuote = stockQuoteResult.data;
        console.log('Successfully fetched stock quote:', stockQuote);
    } else {
        console.warn('Failed to fetch stock quote:', stockQuoteResult.error || stockQuoteResult.message);
    }

    let stockCandles = null;
    if (stockCandlesResult.success) {
        stockCandles = stockCandlesResult.data;
        console.log('Successfully fetched stock candles:', {
            status: stockCandles.s,
            timestamps: stockCandles.t?.length,
            closes: stockCandles.c?.length
        });
    } else {
        console.warn('Failed to fetch stock candles:', stockCandlesResult.error || stockCandlesResult.message);
    }

    const analyzedArticles = newsData.articles
      .filter(article => article.title && article.description)
      .map(article => {
        try {
          const text = `${article.title} ${article.description}`;
          const tokens = new natural.WordTokenizer().tokenize(text);
          const sentimentScore = analyzer.getSentiment(tokens);
          
          return {
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source.name,
            sentiment: sentimentScore
          };
        } catch (error) {
          console.error('Error analyzing article:', error);
          return null;
        }
      })
      .filter(article => article !== null);

    console.log(`Analyzed ${analyzedArticles.length} articles`);

    // Return 404 only if NO data (neither articles, quote, nor candles) is found
    if (analyzedArticles.length === 0 && !stockQuote && !stockCandles) {
      return res.status(404).json({ 
        error: 'No data found for the given query and date range.',
        details: {
          newsArticles: analyzedArticles.length,
          stockQuote: !!stockQuote,
          stockCandles: !!stockCandles
        }
      });
    }

    const response = {
      query,
      totalArticles: analyzedArticles.length,
      articles: analyzedArticles,
      metrics: {
        positive: analyzedArticles.filter(a => a.sentiment > 0).length,
        negative: analyzedArticles.filter(a => a.sentiment < 0).length,
        neutral: analyzedArticles.filter(a => a.sentiment === 0).length,
        volume: analyzedArticles.length,
        tweetsAnalyzed: analyzedArticles.length
      },
      stockQuote: stockQuote,
      stockCandles: stockCandles
    };

    console.log('Sending response with metrics:', response.metrics, 'stock quote presence:', !!response.stockQuote, 'stock candles presence:', !!response.stockCandles);
    res.json(response);
  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({ 
      error: 'Failed to process search request',
      message: error.message,
      details: error.stack
    });
  }
});

export { router as searchRouter };
