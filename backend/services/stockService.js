import finnhub from 'finnhub';
import { getUnixTime, subDays, subWeeks, subMonths, format as formatDate } from 'date-fns'; // Import date-fns functions and format
import twelvedataClientFactory from 'twelvedata';

// Validate API key
if (!process.env.FINNHUB_API_KEY) {
    console.error('FINNHUB_API_KEY is not set in environment variables');
    // Don't throw error here, as quote might still work or user might only need Twelve Data
    // throw new Error('Finnhub API key is required');
}

// Validate Twelve Data API key
if (!process.env.TWELVEDATA_API_KEY) {
    console.error('TWELVEDATA_API_KEY is not set in environment variables');
    // Consider throwing an error or handling this case if candle data is critical
}

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

// Initialize Twelve Data client
const twelvedataClient = twelvedataClientFactory({ key: process.env.TWELVEDATA_API_KEY });

// Helper function to validate symbol
function validateSymbol(symbol) {
    if (!symbol || typeof symbol !== 'string') {
        throw new Error('Invalid symbol: Symbol must be a non-empty string');
    }
    // Remove any whitespace and convert to uppercase
    return symbol.trim().toUpperCase();
}

export async function getStockQuote(symbol) {
    try {
        const validatedSymbol = validateSymbol(symbol);
        console.log(`Fetching stock quote for: ${validatedSymbol}`);
        
        const quote = await new Promise((resolve, reject) => {
            finnhubClient.quote(validatedSymbol, (error, data, response) => {
                if (error) {
                    console.error('Finnhub API error fetching quote:', error);
                    return reject(error);
                }
                console.log('Finnhub API quote response:', data);
                resolve(data);
            });
        });
        
        if (quote && quote.c > 0) {
            return { success: true, data: quote };
        } else {
            console.warn(`No meaningful quote data for ${validatedSymbol}. Response:`, quote);
            return { success: false, message: 'Could not retrieve stock quote.' };
        }
    } catch (error) {
        console.error(`Failed to fetch stock quote for ${symbol}:`, error);
        throw new Error(`Failed to fetch stock quote: ${error.message}`);
    }
}

// New function to fetch quotes for multiple symbols
export async function getMultipleStockQuotes(symbols) {
    if (!Array.isArray(symbols) || symbols.length === 0) {
        console.log('No symbols provided for fetching multiple quotes.');
        return {}; // Return empty object if no symbols
    }
    
    console.log(`Fetching quotes for multiple symbols: ${symbols.join(', ')}`);

    const quotes = {};
    for (const symbol of symbols) {
        try {
            const quoteResult = await getStockQuote(symbol); // Reuse existing getStockQuote function
            if (quoteResult.success) {
                quotes[symbol.toUpperCase()] = quoteResult.data; // Store data by uppercase symbol
            } else {
                console.warn(`Could not fetch quote for ${symbol}: ${quoteResult.message}`);
            }
        } catch (error) {
            console.error(`Error fetching quote for ${symbol}:`, error);
             // Continue with other symbols even if one fails
        }
    }
    
    console.log(`Finished fetching quotes for multiple symbols. Found ${Object.keys(quotes).length} successful quotes.`);
    return quotes;
}

// New function to fetch stock candle (time-series) data
export async function getStockCandles(symbol, dateRange) {
    try {
        const validatedSymbol = validateSymbol(symbol);
        console.log(`Fetching stock candles for: ${validatedSymbol} with range: ${dateRange} using Twelve Data`);

        const now = new Date();
        let interval = '1min'; // Default interval for Twelve Data
        let startDate = null;
        let endDate = formatDate(now, 'yyyy-MM-dd HH:mm:ss');

        // Determine interval and dates based on dateRange for Twelve Data
        switch (dateRange) {
            case 'yesterday':
                interval = '1min';
                startDate = formatDate(subDays(now, 1), 'yyyy-MM-dd 00:00:00'); // Start of yesterday
                endDate = formatDate(subDays(now, 1), 'yyyy-MM-dd 23:59:59'); // End of yesterday
                break;
            case '2d':
                interval = '5min'; // 5-minute candles for 2 days
                startDate = formatDate(subDays(now, 2), 'yyyy-MM-dd 00:00:00');
                 endDate = formatDate(now, 'yyyy-MM-dd HH:mm:ss');
                break;
            case '1w':
                interval = '15min'; // Using 15min for 1 week
                startDate = formatDate(subWeeks(now, 1), 'yyyy-MM-dd HH:mm:ss');
                endDate = formatDate(now, 'yyyy-MM-dd HH:mm:ss');
                break;
            // Add other cases for longer ranges if needed/supported by API
            default:
                 interval = '15min'; // Default to 15-minute candles
                 startDate = formatDate(subWeeks(now, 1), 'yyyy-MM-dd HH:mm:ss');
                 endDate = formatDate(now, 'yyyy-MM-dd HH:mm:ss');
        }

        // Twelve Data API call
        console.log(`Twelve Data candles parameters:`, {
            symbol: validatedSymbol,
            interval,
            startDate,
            endDate
        });

        // Fetch time series data
        const twelveDataResponse = await twelvedataClient.timeSeries({
            symbol: validatedSymbol,
            interval: interval,
            start_date: startDate,
            end_date: endDate,
            outputsize: 5000
        });

        console.log('Twelve Data API candles response status:', twelveDataResponse.status);
        console.log('Twelve Data API candles response data length:', twelveDataResponse.data?.length);

        if (twelveDataResponse.status === 'ok' && twelveDataResponse.data && twelveDataResponse.data.length > 0) {
            // Map Twelve Data response to a format similar to Finnhub candles for frontend compatibility
            const mappedCandles = {
                s: 'ok',
                t: twelveDataResponse.data.map(item => Math.floor(new Date(item.datetime).getTime() / 1000)),
                c: twelveDataResponse.data.map(item => parseFloat(item.close)),
                 o: twelveDataResponse.data.map(item => parseFloat(item.open)),
                 h: twelveDataResponse.data.map(item => parseFloat(item.high)),
                 l: twelveDataResponse.data.map(item => parseFloat(item.low)),
                 v: twelveDataResponse.data.map(item => parseFloat(item.volume))
            };
             console.log('Mapped candles for frontend:', { timestamps: mappedCandles.t.length, closes: mappedCandles.c.length });
            return { success: true, data: mappedCandles };
        } else {
             console.warn(`No meaningful candle data for ${validatedSymbol} with range ${dateRange} from Twelve Data. Response status: ${twelveDataResponse.status}`);
            return { 
                success: false, 
                message: twelveDataResponse.status === 'error' 
                    ? twelveDataResponse.code + ': ' + twelveDataResponse.message
                    : twelveDataResponse.data?.length === 0 
                        ? 'No data available for this period.' 
                        : 'Could not retrieve stock candle data.'
            };
        }

    } catch (error) {
        console.error(`Failed to fetch stock candles for ${symbol} from Twelve Data:`, error);
        throw new Error(`Failed to fetch stock candles: ${error.message}`);
    }
}

// Example of fetching company profile (optional, but good for validation)
export async function getCompanyProfile(symbol) {
   // Keep Finnhub for company profile if Twelve Data doesn't have a direct equivalent or for simplicity
    try {
        const validatedSymbol = validateSymbol(symbol);
        console.log(`Fetching company profile for: ${validatedSymbol} using Finnhub`);
        
        const profile = await new Promise((resolve, reject) => {
            finnhubClient.companyProfile2({ symbol: validatedSymbol }, (error, data, response) => {
                if (error) {
                    console.error('Finnhub API error fetching profile:', error);
                    return reject(error);
                }
                console.log('Finnhub API profile response:', data);
                resolve(data);
            });
        });

        if (profile && profile.name) { // Check if profile data is meaningful
            return { success: true, data: profile };
        } else {
             console.warn(`No meaningful company profile data for ${validatedSymbol} from Finnhub. Response:`, profile);
            return { success: false, message: 'Could not retrieve company profile.' };
        }
    } catch (error) {
        console.error(`Failed to fetch company profile for ${symbol} from Finnhub:`, error);
        throw new Error(`Failed to fetch company profile: ${error.message}`);
    }
} 