import express from 'express';
import natural from 'natural';
import { getNewsForTopic } from '../services/newsService.js';

const router = express.Router();
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");

router.get('/:query', async (req, res) => {
  const { query } = req.params;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }

  try {
    console.log(`Processing search for: ${query}`);
    const newsData = await getNewsForTopic(query);

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

    if (analyzedArticles.length === 0) {
      return res.status(404).json({ error: 'No articles found or could be analyzed' });
    }

    const response = {
      query,
      totalArticles: analyzedArticles.length,
      articles: analyzedArticles,
      metrics: {
        positive: analyzedArticles.filter(a => a.sentiment > 0).length,
        negative: analyzedArticles.filter(a => a.sentiment < 0).length,
        neutral: analyzedArticles.filter(a => a.sentiment === 0).length,
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({ 
      error: 'Failed to process search request',
      message: error.message 
    });
  }
});

export { router as searchRouter };
