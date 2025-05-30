import express from 'express';
import { TwitterApi } from 'twitter-api-v2';

const router = express.Router();

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

router.get('/search/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const tweets = await client.v2.search(`${symbol} stock OR ${symbol} price`);
    res.json(tweets.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as twitterRouter };
