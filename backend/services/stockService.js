import finnhub from 'finnhub';
import { getUnixTime, subDays, subWeeks, subMonths } from 'date-fns'; // Import date-fns functions

// Validate API key
if (!process.env.FINNHUB_API_KEY) {
    console.error('FINNHUB_API_KEY is not set in environment variables');
    throw new Error('Finnhub API key is required');
}

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

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

// New function to fetch stock candle (time-series) data
export async function getStockCandles(symbol, dateRange) {
    try {
        const validatedSymbol = validateSymbol(symbol);
        console.log(`Fetching stock candles for: ${validatedSymbol} with range: ${dateRange}`);

        const now = new Date();
        let resolution = '1'; // Default to 1-minute resolution
        let fromDate = now; // Default to current time

        // Determine resolution and time period based on dateRange
        switch (dateRange) {
            case 'yesterday':
                resolution = '1'; // 1-minute candles for yesterday
                fromDate = subDays(now, 1); // Start of yesterday
                break;
            case '2d':
                resolution = '5'; // 5-minute candles for 2 days
                fromDate = subDays(now, 2); // Start of 2 days ago
                break;
            case '1w':
                resolution = '60'; // 60-minute candles for 1 week
                fromDate = subWeeks(now, 1); // Start of 1 week ago
                break;
            // Add other cases for longer ranges if needed/supported by API
            default:
                 resolution = '60'; // Default to 60-minute candles
                 fromDate = subWeeks(now, 1); // Default to 1 week ago
        }

        // Validate dates
        if (fromDate > now) {
            throw new Error('Invalid date range: fromDate cannot be in the future');
        }

        // Finnhub requires timestamps in seconds
        const fromUnixTime = Math.floor(fromDate.getTime() / 1000);
        const toUnixTime = Math.floor(now.getTime() / 1000);

        console.log(`Finnhub candles parameters:`, {
            symbol: validatedSymbol,
            resolution,
            fromUnixTime,
            toUnixTime,
            fromDate: fromDate.toISOString(),
            toDate: now.toISOString()
        });

        const candles = await new Promise((resolve, reject) => {
            finnhubClient.stockCandles(
                validatedSymbol,
                resolution,
                fromUnixTime,
                toUnixTime,
                (error, data, response) => {
                    if (error) {
                        console.error('Finnhub API error fetching candles:', {
                            error,
                            status: response?.status,
                            statusText: response?.statusText,
                            headers: response?.headers
                        });
                        return reject(error);
                    }
                    console.log('Finnhub API candles response:', {
                        status: data.s,
                        timestamps: data.t?.length,
                        closes: data.c?.length
                    });
                    resolve(data);
                }
            );
        });

        if (candles && candles.s === 'ok' && candles.t && candles.t.length > 0) {
            return { success: true, data: candles };
        } else {
             console.warn(`No meaningful candle data for ${validatedSymbol} with range ${dateRange}. Response status: ${candles?.s}`);
            return { 
                success: false, 
                message: candles?.s === 'no_data' 
                    ? 'No data available for this period.' 
                    : 'Could not retrieve stock candle data.'
            };
        }

    } catch (error) {
        console.error(`Failed to fetch stock candles for ${symbol}:`, error);
        throw new Error(`Failed to fetch stock candles: ${error.message}`);
    }
}

// Example of fetching company profile (optional, but good for validation)
export async function getCompanyProfile(symbol) {
    try {
        const validatedSymbol = validateSymbol(symbol);
        console.log(`Fetching company profile for: ${validatedSymbol}`);
        
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
             console.warn(`No meaningful company profile data for ${validatedSymbol}. Response:`, profile);
            return { success: false, message: 'Could not retrieve company profile.' };
        }
    } catch (error) {
        console.error(`Failed to fetch company profile for ${symbol}:`, error);
        throw new Error(`Failed to fetch company profile: ${error.message}`);
    }
} 