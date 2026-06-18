/**
 * Jobs SEO Routes
 * Handles job detail pages, programmatic SEO, and sharing functionality
 * Routes: /api/jobs-seo/*
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const seoUtils = require('../utils/seo');

/**
 * GET /api/jobs-seo/by-slug/:slug
 * Get job by URL slug with full SEO data
 * Used for: Job detail page
 */
router.get('/by-slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT 
        j.*,
        r.company_name as recruiter_company,
        r.company_logo_url
      FROM jobs j
      LEFT JOIN recruiters r ON j.recruiter_id = r.id
      WHERE j.slug = $1 AND j.is_backfilled = false
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = result.rows[0];

    // Generate SEO metadata
    const jsonLd = seoUtils.generateJobPostingJsonLd(job);
    const ogMeta = seoUtils.generateOpenGraphMeta(job, process.env.SITE_URL || 'http://localhost:3000');
    const sharingTemplates = seoUtils.generateSharingTemplates(job, process.env.SITE_URL || 'http://localhost:3000');

    res.json({
      ...job,
      seo: {
        jsonLd,
        ogMeta,
        sharingTemplates
      }
    });
  } catch (err) {
    console.error('Error fetching job by slug:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/jobs-seo/:id
 * Get job by ID with full SEO data
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        j.*,
        r.company_name as recruiter_company,
        r.company_logo_url
      FROM jobs j
      LEFT JOIN recruiters r ON j.recruiter_id = r.id
      WHERE j.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = result.rows[0];

    // Generate SEO metadata
    const jsonLd = seoUtils.generateJobPostingJsonLd(job);
    const ogMeta = seoUtils.generateOpenGraphMeta(job, process.env.SITE_URL || 'http://localhost:3000');
    const sharingTemplates = seoUtils.generateSharingTemplates(job, process.env.SITE_URL || 'http://localhost:3000');

    res.json({
      ...job,
      seo: {
        jsonLd,
        ogMeta,
        sharingTemplates
      }
    });
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/jobs-seo/share-templates/:id
 * Get sharing templates for a specific job
 */
router.get('/:id/share-templates', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, title, company_name, work_location_type, base_salary_min, base_salary_max, currency, slug
      FROM jobs
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = result.rows[0];
    const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
    const sharingTemplates = seoUtils.generateSharingTemplates(job, baseUrl);

    res.json(sharingTemplates);
  } catch (err) {
    console.error('Error generating share templates:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/jobs-seo/:id/track-view
 * Track job view for analytics and SEO metrics
 */
router.post('/:id/track-view', async (req, res) => {
  try {
    const { id } = req.params;

    // Increment view count
    const updateQuery = `
      UPDATE jobs 
      SET views_count = views_count + 1 
      WHERE id = $1
    `;

    await pool.query(updateQuery, [id]);

    // Record analytics
    const analyticsQuery = `
      INSERT INTO job_analytics (job_id, metric_type, count)
      VALUES ($1, 'view', 1)
      ON CONFLICT (job_id, metric_type, recorded_date) 
      DO UPDATE SET count = count + 1
    `;

    await pool.query(analyticsQuery, [id]);

    res.json({ success: true });
  } catch (err) {
    console.error('Error tracking view:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/jobs-seo/:id/track-share
 * Track job shares for viral metrics
 */
router.post('/:id/track-share', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, jobseeker_id } = req.body;

    if (!platform || !jobseeker_id) {
      return res.status(400).json({ error: 'Platform and jobseeker_id required' });
    }

    // Insert share record
    const insertQuery = `
      INSERT INTO job_shares (job_id, jobseeker_id, platform)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    await pool.query(insertQuery, [id, jobseeker_id, platform]);

    // Increment share count
    const updateQuery = `
      UPDATE jobs 
      SET share_count = share_count + 1 
      WHERE id = $1
    `;

    await pool.query(updateQuery, [id]);

    // Record analytics
    const analyticsQuery = `
      INSERT INTO job_analytics (job_id, metric_type, count)
      VALUES ($1, 'share', 1)
      ON CONFLICT (job_id, metric_type, recorded_date) 
      DO UPDATE SET count = count + 1
    `;

    await pool.query(analyticsQuery, [id]);

    res.json({ success: true, message: 'Share tracked' });
  } catch (err) {
    console.error('Error tracking share:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
