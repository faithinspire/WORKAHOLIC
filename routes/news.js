const express = require('express');
const router = express.Router();
const { pool, supabaseRESTQuery, dbConnected, isUsingRESTAPI } = require('../config/database');

// In-memory news cache with auto-refresh
let newsCache = [];
let lastNewsRefreshTime = Date.now();
const NEWS_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

// Sample news data - will be used if database is unavailable
const SAMPLE_NEWS = [
    {
        id: 1,
        title: 'New Teaching Opportunities in Lagos',
        description: 'Over 500 teaching positions available in Lagos state for qualified educators',
        source: 'WORKAHOLIC',
        category: 'jobs',
        external_url: 'https://workaholic.ng/jobs',
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a5?w=500&h=300',
        published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 2,
        title: 'Tech Industry Hiring Surge in Nigeria',
        description: 'Tech companies are actively recruiting developers, engineers, and IT professionals',
        source: 'TechCrunch',
        category: 'tech',
        external_url: 'https://techcrunch.com',
        image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300',
        published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 3,
        title: 'NYSC 2026 Batch A Registration Opens',
        description: 'Fresh graduates can now register for the National Youth Service Corps program',
        source: 'NYSC Official',
        category: 'opportunities',
        external_url: 'https://nysc.gov.ng',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300',
        published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 4,
        title: 'University Recruitment Drive - Multiple Positions',
        description: 'Multiple universities are recruiting lecturers, professors, and research staff across various disciplines',
        source: 'Education Hub',
        category: 'education',
        external_url: 'https://workaholic.ng',
        image_url: 'https://images.unsplash.com/photo-1595521624200-81e6dae4ff89?w=500&h=300',
        published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 5,
        title: 'Freelancing Opportunities for Nigerian Professionals',
        description: 'Global companies are actively hiring freelance workers from Nigeria for remote positions',
        source: 'Upwork',
        category: 'jobs',
        external_url: 'https://upwork.com',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300',
        published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
    }
];

// Initialize news cache on startup
async function initializeNewsCache() {
    try {
        if (dbConnected() && pool) {
            try {
                // Try PostgreSQL first
                const result = await pool.query('SELECT * FROM news_feeds ORDER BY published_at DESC LIMIT 50');
                if (result && result.rows && result.rows.length > 0) {
                    newsCache = result.rows;
                    console.log('✅ News cache initialized with', newsCache.length, 'articles from Supabase');
                    lastNewsRefreshTime = Date.now();
                    return;
                }
            } catch (error) {
                // Try REST API
                try {
                    const result = await supabaseRESTQuery('news_feeds', '*', {});
                    if (result && result.rows && result.rows.length > 0) {
                        newsCache = result.rows;
                        console.log('✅ News cache initialized with', newsCache.length, 'articles from Supabase REST API');
                        lastNewsRefreshTime = Date.now();
                        return;
                    }
                } catch (restError) {
                    console.warn('⚠️  REST API also failed:', restError.message);
                }
            }
        }
        // Fallback to sample data
        newsCache = SAMPLE_NEWS;
        console.log('⚠️  Using sample news data (Supabase unavailable)');
        lastNewsRefreshTime = Date.now();
    } catch (error) {
        console.warn('⚠️  Could not load news from database:', error.message);
        newsCache = SAMPLE_NEWS;
        lastNewsRefreshTime = Date.now();
    }
}

// Schedule automatic news refresh every 1 hour
function scheduleNewsRefresh() {
    setInterval(async () => {
        console.log('🔄 Auto-refreshing news feeds...');
        await refreshNewsFeeds();
    }, NEWS_REFRESH_INTERVAL);
}

// Refresh news feeds
async function refreshNewsFeeds() {
    try {
        if (dbConnected() && pool) {
            try {
                const result = await pool.query('SELECT * FROM news_feeds ORDER BY published_at DESC LIMIT 50');
                if (result && result.rows && result.rows.length > 0) {
                    newsCache = result.rows;
                    console.log('✅ News feeds refreshed from Supabase');
                    lastNewsRefreshTime = Date.now();
                    return true;
                }
            } catch (error) {
                try {
                    const result = await supabaseRESTQuery('news_feeds', '*', {});
                    if (result && result.rows && result.rows.length > 0) {
                        newsCache = result.rows;
                        console.log('✅ News feeds refreshed from Supabase REST API');
                        lastNewsRefreshTime = Date.now();
                        return true;
                    }
                } catch (restError) {
                    console.warn('⚠️  Could not refresh from REST API');
                }
            }
        }
        // Fallback: use sample data
        newsCache = SAMPLE_NEWS;
        lastNewsRefreshTime = Date.now();
        console.log('⚠️  Using sample data for refresh');
        return true;
    } catch (error) {
        console.error('⚠️  Error refreshing news:', error.message);
        newsCache = SAMPLE_NEWS;
        lastNewsRefreshTime = Date.now();
        return false;
    }
}

// Get all news feeds
router.get('/all', async (req, res) => {
    try {
        const category = req.query.category || null;
        
        // Return cached news if available
        let news = newsCache;
        
        if (category) {
            news = news.filter(n => n.category === category);
        }

        res.json({
            success: true,
            news: news.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)),
            total: news.length,
            lastUpdated: new Date(lastNewsRefreshTime),
            nextUpdate: new Date(lastNewsRefreshTime + NEWS_REFRESH_INTERVAL),
            source: dbConnected() ? (isUsingRESTAPI() ? 'Supabase REST API' : 'Supabase PostgreSQL') : 'Sample Data',
            databaseStatus: dbConnected() ? 'Connected' : 'Offline (using fallback)',
            connectionType: isUsingRESTAPI() ? 'REST API' : 'Direct PostgreSQL',
            nextAutoRefresh: Math.round((lastNewsRefreshTime + NEWS_REFRESH_INTERVAL - Date.now()) / 1000) + ' seconds'
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news', error: error.message });
    }
});

// Refresh news from API (manual trigger)
router.post('/refresh', async (req, res) => {
    try {
        const result = await refreshNewsFeeds();
        res.json({
            success: result,
            message: result ? 'News refreshed successfully' : 'News refresh completed with fallback data',
            count: newsCache.length,
            source: dbConnected() ? (isUsingRESTAPI() ? 'Supabase REST API' : 'Supabase PostgreSQL') : 'Sample Data',
            nextAutoRefresh: new Date(lastNewsRefreshTime + NEWS_REFRESH_INTERVAL),
            databaseStatus: dbConnected() ? 'Connected' : 'Offline'
        });
    } catch (error) {
        console.error('Error refreshing news:', error);
        res.status(500).json({ message: 'Error refreshing news', error: error.message });
    }
});

// Get refresh status
router.get('/status', async (req, res) => {
    try {
        const nextRefresh = new Date(lastNewsRefreshTime + NEWS_REFRESH_INTERVAL);
        const minutesUntilRefresh = Math.round((nextRefresh - Date.now()) / 60000);
        
        res.json({
            success: true,
            lastRefreshed: new Date(lastNewsRefreshTime),
            nextRefresh: nextRefresh,
            minutesUntilRefresh: Math.max(0, minutesUntilRefresh),
            totalArticles: newsCache.length,
            refreshInterval: `${NEWS_REFRESH_INTERVAL / (60 * 1000)} minutes`,
            source: dbConnected() ? (isUsingRESTAPI() ? 'Supabase REST API' : 'Supabase PostgreSQL') : 'Sample Data',
            databaseStatus: dbConnected() ? 'Connected' : 'Offline (using fallback)',
            connectionType: isUsingRESTAPI() ? 'REST API' : 'Direct PostgreSQL'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add news manually (admin)
router.post('/add', async (req, res) => {
    try {
        const { title, description, source, category, external_url, image_url } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newsItem = {
            title,
            description,
            source: source || 'WORKAHOLIC',
            category,
            external_url: external_url || '',
            image_url: image_url || '',
            published_at: new Date().toISOString()
        };

        if (dbConnected() && pool) {
            try {
                const result = await pool.query(
                    `INSERT INTO news_feeds (title, description, source, category, external_url, image_url, published_at, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                     RETURNING *`,
                    [newsItem.title, newsItem.description, newsItem.source, newsItem.category, newsItem.external_url, newsItem.image_url, newsItem.published_at]
                );
                
                if (result.rows.length > 0) {
                    await initializeNewsCache();
                    res.status(201).json({
                        success: true,
                        message: 'News added to Supabase successfully',
                        news: result.rows[0]
                    });
                    return;
                }
            } catch (error) {
                console.warn('Could not insert to Supabase:', error.message);
            }
        }

        // Fallback: add to cache only
        newsItem.id = newsCache.length + 1;
        newsCache.unshift(newsItem);
        res.status(201).json({
            success: true,
            message: 'News added to cache (database offline)',
            news: newsItem
        });
    } catch (error) {
        console.error('Error adding news:', error);
        res.status(500).json({ message: 'Error adding news', error: error.message });
    }
});

// Initialize on module load
initializeNewsCache();
scheduleNewsRefresh();

module.exports = router;
