import fetch from 'node-fetch';

export async function getStockPrice(symbol) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    return data['Global Quote'];
  } catch (error) {
    throw new Error(`Failed to fetch stock price: ${error.message}`);
  }
}
