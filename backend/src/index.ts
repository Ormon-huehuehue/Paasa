/**
 * Stock Data Proxy Backend Server
 */

import express, { Request, Response } from 'express';
import { yahooFinanceService } from './services/yahooFinanceService.js';
import { logger } from './utils/logger.js';
import { getConfig } from './config/environment.js';

const app = express();
const config = getConfig();

app.use(express.json());

// Helper function to handle async requests and errors
const proxyHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
    async (req: Request, res: Response) => {
        try {
            await fn(req, res);
        } catch (error) {
            logger.error('API Error', { url: req.url, method: req.method }, error as Error);
            res.status(500).json({ 
                error: 'Failed to fetch data from external API', 
                detail: (error as Error).message 
            });
        }
    };

// --- Endpoints ---

/**
 * Endpoint 1: Market Indexes (/indexes)
 * Fetches quotes for major indices.
 */
app.get('/indexes', proxyHandler(async (req, res) => {
    const indexes = await yahooFinanceService.getMarketIndexes();
    res.json(indexes);
}));


/**
 * Endpoints 2, 3, 4: Gainers, Losers, and Active (/gainers, /losers, /active)
 * These use our Yahoo Finance service methods.
 */
app.get('/gainers', proxyHandler(async (req, res) => {
    const stocks = await yahooFinanceService.getTopGainers();
    res.json({ title: 'Top Gainers', stocks });
}));

app.get('/losers', proxyHandler(async (req, res) => {
    const stocks = await yahooFinanceService.getTopLosers();
    res.json({ title: 'Top Losers', stocks });
}));

app.get('/active', proxyHandler(async (req, res) => {
    const stocks = await yahooFinanceService.getMostActive();
    res.json({ title: 'Most Active', stocks });
}));


/**
 * Endpoint 5: Spotlight Stock (/spotlight)
 * Fetches detailed info for a single, featured stock (e.g., Apple: AAPL)
 */
app.get('/spotlight', proxyHandler(async (req, res) => {
    const symbol = req.query.symbol as string || 'AAPL'; // Default to Apple
    const spotlightStock = await yahooFinanceService.getSpotlightStock(symbol);
    res.json(spotlightStock);
}));


/**
 * Endpoint 6: Latest Financial News (/news)
 * Fetches news related to a financial topic (e.g., US stocks, technology)
 */
app.get('/news', proxyHandler(async (req, res) => {
    const query = req.query.q as string || 'US stocks'; // Default query
    const news = await yahooFinanceService.getLatestNews(query);
    res.json(news);
}));


// Start the server
app.listen(config.port, () => {
    logger.info(`Server is running at http://localhost:${config.port}`);
    logger.info(`Available endpoints: /indexes, /gainers, /losers, /active, /spotlight?symbol=MSFT, /news?q=tech`);
});