import express from 'express';
import natural from 'natural';
const Analyzer = natural.SentimentAnalyzer;
const analyzer = new Analyzer("English", natural.PorterStemmer, "afinn");

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { texts } = req.body;
    const results = texts.map(text => {
      const tokens = new natural.WordTokenizer().tokenize(text);
      const sentiment = analyzer.getSentiment(tokens);
      return {
        text,
        sentiment,
        classification: sentiment > 0 ? 'positive' : sentiment < 0 ? 'negative' : 'neutral'
      };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as sentimentRouter };
