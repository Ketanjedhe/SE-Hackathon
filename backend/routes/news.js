import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/search/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${symbol}%20stock&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();
    
    const processedNews = data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name
    }));

    res.json(processedNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as newsRouter };
