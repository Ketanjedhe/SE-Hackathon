import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { searchRouter } from './routes/search.js';
import { sentimentRouter } from './routes/sentiment.js';
import { newsRouter } from './routes/news.js';

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
