import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchRouter } from './routes/search.js';
import { sentimentRouter } from './routes/sentiment.js';

// Ensure proper loading of .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate required environment variables
if (!process.env.NEWS_API_KEY) {
  console.error('ERROR: NEWS_API_KEY is not configured in .env file');
  process.exit(1);
}

console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  NEWS_API_KEY: process.env.NEWS_API_KEY ? 'Configured' : 'Missing'
});

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/search', searchRouter);
app.use('/api/sentiment', sentimentRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
