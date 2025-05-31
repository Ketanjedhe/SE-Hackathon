import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { searchRouter } from './routes/search.js';
import { sentimentRouter } from './routes/sentiment.js';
import { newsRouter } from './routes/news.js';
import competitors from './competitors.js'; // Import competitors mapping

const app = express();

// Make config available globally
global.config = config;

console.log('Config loaded:', {
  PORT: config.PORT,
  NEWS_API_KEY: `${config.NEWS_API_KEY.substring(0, 5)}...`
});

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// New route to get competitors for a company symbol
app.get('/api/competitors/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const comp = competitors[symbol];
  if (comp) {
    res.json({ competitors: comp });
  } else {
    res.status(404).json({ error: 'No competitors found for this symbol.' });
  }
});

// Routes
app.use('/api/search', searchRouter);
app.use('/api/sentiment', sentimentRouter);
app.use('/api/news', newsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});