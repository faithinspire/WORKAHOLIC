const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

// In-memory cache for external news
let externalNewsCache = [];
let lastExternalRefresh = Date.now();
const EXTERNAL_NEWS_REFRESH = 30 * 60 * 1000; // 30 minutes

/**
 * Fetch news from NewsAPI.org
 * Free tier: max 100 requests per day
 */
async function fetchNewsAPI() {
    return new Promise((resolve) => {
        const apiKey = process.env.NEWS_API_KEY || 'demo'; // You can add your own API key to .env
        const queries = [
            'teaching jobs Nigeria',
            'recruitment Nigeria',
            'employment opportunities',
            'career development',
        ];

        const allNews = [];
        let completed = 0;

        queries.forEach((query, index) => {
            // Stagger requests to avoid rate limiting
            setTimeout(() => {
                const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${apiKey}`;
                
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            const json = JSON.parse(data);
                            if (json.articles) {
                                allNews.push(...json.articles.map(article => ({
                                    title: article.title,
                                    description: article.description,
                                    source: article.source?.name || 'News API',
                                    category: 'jobs',
                                    external_url: article.url,
                                    image_url: article.urlToImage,
                                    published_at: new Date(article.publishedAt).toISOString(),
                                    author: article.author,
                                })));
                            }
                        } catch (e) {
                            console.log('Failed to parse NewsAPI response');
                        }
                        
                        completed++;
                        if (completed === queries.length) {
                            resolve(allNews);
                        }
                    });
                }).on('error', () => {
                    completed++;
                    if (completed === queries.length) {
                        resolve(allNews);
                    }
                });
            }, index * 500); // 500ms delay between requests
        });

        // Timeout after 15 seconds
        setTimeout(() => {
            if (completed < queries.length) {
                console.warn('NewsAPI request timeout, returning partial results');
                resolve(allNews);
            }
        }, 15000);
    });
}

/**
 * Fetch news from Bing News Search
 */
async function fetchBingNews() {
    return new Promise((resolve) => {
        const searchTerms = 'teaching jobs Nigeria recruitment employment';
        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(searchTerms)}&format=rss`;
        
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    // Simple RSS parser
                    const newsItems = [];
                    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
                    const matches = data.matchAll(itemRegex);
                    
                    for (const match of matches) {
                        const item = match[1];
                        const titleMatch = /<title[^>]*>([^<]+)<\/title>/.exec(item);
                        const descMatch = /<description[^>]*>([^<]+)<\/description>/.exec(item);
                        const linkMatch = /<link[^>]*>([^<]+)<\/link>/.exec(item);
                        const pubDateMatch = /<pubDate[^>]*>([^<]+)<\/pubDate>/.exec(item);
                        
                        if (titleMatch) {
                            newsItems.push({
                                title: titleMatch[1],
                                description: descMatch ? descMatch[1] : '',
                                source: 'Bing News',
                                category: 'jobs',
                                external_url: linkMatch ? linkMatch[1] : '',
                                image_url: null,
                                published_at: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
                            });
                        }
                        
                        if (newsItems.length >= 10) break;
                    }
                    resolve(newsItems);
                } catch (e) {
                    console.log('Failed to parse Bing RSS');
                    resolve([]);
                }
            });
        }).on('error', () => {
            console.log('Bing News fetch failed');
            resolve([]);
        });

        // Timeout after 10 seconds
        setTimeout(() => resolve([]), 10000);
    });
}

/**
 * Fetch news from custom local sources
 */
function fetchLocalNews() {
    return [
        {
            title: '🎓 New Teaching Positions Available in Lagos - Over 500 Vacancies',
            description: 'Multiple educational institutions in Lagos are recruiting qualified teachers across all subjects and levels. Competitive salary and benefits offered.',
            source: 'WORKAHOLIC Platform',
            category: 'jobs',
            external_url: 'https://workaholic.ng/jobs/teaching',
            image_url: null,
            published_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
            title: '💼 Tech Recruitment Drive - Software Engineers Wanted',
            description: 'Leading tech companies in Nigeria are actively hiring experienced software engineers, developers, and IT professionals for remote and on-site positions.',
            source: 'Tech Careers',
            category: 'jobs',
            external_url: 'https://workaholic.ng/jobs/tech',
            image_url: null,
            published_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
        {
            title: '📚 University Lecturer Positions - Now Hiring',
            description: 'Major universities across Nigeria are opening applications for lecturer, senior lecturer, and professor positions in various academic disciplines.',
            source: 'Education Hub',
            category: 'education',
            external_url: 'https://workaholic.ng/jobs/university',
            image_url: null,
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: '🌍 Freelance Opportunities for Nigerian Professionals',
            description: 'International companies are actively hiring Nigerian freelancers for various remote projects. Register today to see opportunities.',
            source: 'Global Freelance',
            category: 'jobs',
            external_url: 'https://workaholic.ng/jobs/freelance',
            image_url: null,
            published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: '🏢 Government Job Recruitment Exam Schedule Released',
            description: 'JAMB, FIRS, and other government agencies have released their 2026 recruitment schedules. Registration is now open for interested candidates.',
            source: 'Government Jobs',
            category: 'opportunities',
            external_url: 'https://workaholic.ng/jobs/government',
            image_url: null,
            published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
    ];
}

/**
 * Refresh external news from multiple sources
 */
async function refreshExternalNews() {
    try {
        console.log('🔄 Fetching external news from multiple sources...');
        
        const [newsAPIArticles, bingArticles] = await Promise.all([
            fetchNewsAPI().catch(e => {
                console.warn('NewsAPI fetch failed:', e.message);
                return [];
            }),
            fetchBingNews().catch(e => {
                console.warn('Bing News fetch failed:', e.message);
                return [];
            }),
        ]);

        const localNews = fetchLocalNews();

        // Combine all sources
        externalNewsCache = [
            ...localNews,
            ...newsAPIArticles.slice(0, 5),
            ...bingArticles.slice(0, 5),
        ].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        lastExternalRefresh = Date.now();
        console.log(`✅ External news updated: ${externalNewsCache.length} articles`);
        
        return externalNewsCache;
    } catch (error) {
        console.error('Error refreshing external news:', error);
        // Return local news on error
        externalNewsCache = fetchLocalNews();
        return externalNewsCache;
    }
}

/**
 * GET /api/external-news/all
 * Get all external news from multiple sources
 */
router.get('/all', async (req, res) => {
    try {
        const { limit = 20, category } = req.query;

        let news = externalNewsCache;

        if (category) {
            news = news.filter(n => n.category === category);
        }

        res.json({
            success: true,
            news: news.slice(0, parseInt(limit)),
            total: news.length,
            lastUpdated: new Date(lastExternalRefresh),
            nextUpdate: new Date(lastExternalRefresh + EXTERNAL_NEWS_REFRESH),
            refreshInterval: '30 minutes',
            sources: ['WORKAHOLIC Platform', 'NewsAPI', 'Bing News', 'Local Sources'],
        });
    } catch (error) {
        console.error('Error fetching external news:', error);
        res.status(500).json({ success: false, message: 'Error fetching news', error: error.message });
    }
});

/**
 * POST /api/external-news/refresh
 * Manually refresh external news
 */
router.post('/refresh', async (req, res) => {
    try {
        const news = await refreshExternalNews();
        res.json({
            success: true,
            message: 'External news refreshed successfully',
            count: news.length,
            nextAutoRefresh: new Date(lastExternalRefresh + EXTERNAL_NEWS_REFRESH),
        });
    } catch (error) {
        console.error('Error manually refreshing:', error);
        res.status(500).json({ success: false, message: 'Error refreshing news', error: error.message });
    }
});

/**
 * GET /api/external-news/status
 * Get refresh status
 */
router.get('/status', (req, res) => {
    const nextRefresh = new Date(lastExternalRefresh + EXTERNAL_NEWS_REFRESH);
    const minutesUntilRefresh = Math.round((nextRefresh - Date.now()) / 60000);

    res.json({
        success: true,
        lastUpdated: new Date(lastExternalRefresh),
        nextUpdate: nextRefresh,
        minutesUntilRefresh: Math.max(0, minutesUntilRefresh),
        totalArticles: externalNewsCache.length,
        refreshInterval: '30 minutes',
        sources: ['WORKAHOLIC', 'NewsAPI', 'Bing News', 'Local Sources'],
    });
});

/**
 * GET /api/external-news/search
 * Search external news
 */
router.get('/search', (req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({ success: false, message: 'Search query required' });
        }

        const query = q.toLowerCase();
        const results = externalNewsCache.filter(news => 
            news.title.toLowerCase().includes(query) ||
            news.description?.toLowerCase().includes(query)
        ).slice(0, parseInt(limit));

        res.json({
            success: true,
            query: q,
            results,
            total: results.length,
        });
    } catch (error) {
        console.error('Error searching news:', error);
        res.status(500).json({ success: false, message: 'Error searching news', error: error.message });
    }
});

/**
 * GET /api/external-news/category/:category
 * Get news by category
 */
router.get('/category/:category', (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 20 } = req.query;

        const categoryNews = externalNewsCache.filter(n => n.category === category).slice(0, parseInt(limit));

        res.json({
            success: true,
            category,
            news: categoryNews,
            total: categoryNews.length,
        });
    } catch (error) {
        console.error('Error fetching category news:', error);
        res.status(500).json({ success: false, message: 'Error fetching news', error: error.message });
    }
});

// Initialize news on startup
(async () => {
    console.log('📰 Initializing external news...');
    await refreshExternalNews();
})();

// Schedule auto-refresh every 30 minutes
setInterval(refreshExternalNews, EXTERNAL_NEWS_REFRESH);

module.exports = router;
