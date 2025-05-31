// Mapping of major companies to their competitors (by stock symbol)
const competitors = {
  "GOOGL": ["AAPL", "MSFT", "AMZN", "META", "BIDU"],      // Google (Alphabet)
  "AAPL": ["GOOGL", "MSFT", "SAMSUNG", "DELL", "HPQ"],    // Apple
  "MSFT": ["GOOGL", "AAPL", "AMZN", "ORCL", "IBM"],       // Microsoft
  "AMZN": ["GOOGL", "MSFT", "WMT", "BABA", "EBAY"],       // Amazon
  "META": ["GOOGL", "AAPL", "SNAP", "TWTR", "PINS"],      // Meta (Facebook)
  "TSLA": ["GM", "F", "NIO", "RIVN", "BYDDF"],            // Tesla
  "NFLX": ["DIS", "AMZN", "AAPL", "WBD", "CMCSA"],        // Netflix
  "NVDA": ["AMD", "INTC", "QCOM", "TSM", "AVGO"],         // Nvidia
  "INTC": ["AMD", "NVDA", "QCOM", "TSM", "AVGO"],         // Intel
  "BABA": ["AMZN", "JD", "PDD", "TCEHY", "WMT"],          // Alibaba
  // Add more companies and competitors as needed
};

export default competitors;