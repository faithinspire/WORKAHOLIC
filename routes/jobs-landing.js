/**
 * Jobs Landing Pages Routes
 * Handles programmatic SEO landing pages with dynamic filtering
 * Routes: /api/jobs-landing/*
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const seoUtils = require('../utils/seo');

/**
 * GET /api/jobs-landing/by-role/:role
 * Get jobs filtered by role/category
 * Example: /jobs-landing/by-role/python-developer
 */
router.get('/by-role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Fetch category to verify it exists
    const categoryQuery = `
      SELECT * FROM job_categories WHERE slug = $1 AND is_active = true
    `;

    const categoryResult = await pool.query(categoryQuery, [role]);

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = categoryResult.rows[0];

    // Fetch jobs in this category
    const jobsQuery = `
      SELECT DISTINCT j.*
      FROM jobs j
      INNER JOIN job_category_mapping jcm ON j.id = jcm.job_id
      WHERE jcm.category_id = $1 AND j.is_backfilled = false
      ORDER BY j.date_posted DESC
      LIMIT $2 OFFSET $3
    `;

    const jobsResult = await pool.query(jobsQuery, [category.id, limit, offset]);

    // Generate SEO metadata for the landing page
    const seoMeta = seoUtils.generateProgrammaticSeoMeta({
      category: category.name,
      role: null,
      location: null
    });

    res.json({
      category,
      jobs: jobsResult.rows,
      seo: {
        title: seoMeta.title,
        description: seoMeta.description,
        ogImage: null // Could generate dynamic OG image here
      },
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: jobsResult.rows.length
      }
    });
  } catch (err) {
    console.error('Error fetching jobs by role:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/jobs-landing/by-location/:location
 * Get jobs filtered by location
 * Example: /jobs-landing/by-location/remote
 */
router.get('/by-location/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Fetch location to verify it exists
    const locationQuery = `
      SELECT * FROM job_locations WHERE slug = $1 AND is_active = true
    `;

    const locationResult = await pool.query(locationQuery, [location]);

    if (locationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const locationData = locationResult.rows[0];

    // Fetch jobs in this location
    const jobsQuery = `
      SELECT DISTINCT j.*
      FROM jobs j
      INNER JOIN job_location_mapping jlm ON j.id = jlm.job_id
      WHERE jlm.location_id = $1 AND j.is_backfilled = false
      ORDER BY j.date_posted DESC
      LIMIT $2 OFFSET $3
    `;

    const jobsResult = await pool.query(jobsQuery, [locationData.id, limit, offset]);

    // Generate SEO metadata for the landing page
    const seoMeta = seoUtils.generateProgrammaticSeoMeta({
      location: locationData.name,
      role: null,
      category: null
    });

    res.json({
      location: locationData,
      jobs: jobsResult.rows,
      seo: {
        title: seoMeta.title,
        description: seoMeta.description,
        ogImage: null
      },
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: jobsResult.rows.length
      }
    });
  } catch (err) {
    console.error('Error fetching jobs by location:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/jobs-landing/:role/:location
 * Get jobs filtered by both role and location
 * Example: /jobs-landing/python-developer/remote
 */
router.get('/:role/:location', async (req, res) => {
  try {
    const { role, location } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Fetch category
    const categoryQuery = `
      SELECT * FROM job_categories WHERE slug = $1 AND is_active = true
    `;

    const categoryResult = await pool.query(categoryQuery, [role]);

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Fetch location
    const locationQuery = `
      SELECT * FROM job_locations WHERE slug = $1 AND is_active = true
    `;

    const locationResult = await pool.query(locationQuery, [location]);

    if (locationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const category = categoryResult.rows[0];
    const locationData = locationResult.rows[0];

    // Fetch jobs matching both filters
    const jobsQuery = `
      SELECT DISTINCT j.*
      FROM jobs j
      INNER JOIN job_category_mapping jcm ON j.id = jcm.job_id
      INNER JOIN job_location_mapping jlm ON j.id = jlm.job_id
      WHERE jcm.category_id = $1 AND jlm.location_id = $2 AND j.is_backfilled = false
      ORDER BY j.date_posted DESC
      LIMIT $3 OFFSET $4
    `;

    const jobsResult = await pool.query(jobsQuery, [
      category.id,
      locationData.id,
      limit,
      offset
    ]);

    // Generate SEO metadata for the landing page
    const seoMeta = seoUtils.generateProgrammaticSeoMeta({
      category: category.name,
      location: locationData.name,
      role: null
    });

    res.json({
      category,
      location: locationData,
      jobs: jobsResult.rows,
      seo: {
        title: seoMeta.title,
        description: seoMeta.description,
        ogImage: null
      },
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: jobsResult.rows.length
      }
    });
  } catch (err) {
    console.error('Error fetching jobs by role and location:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/jobs-landing/categories
 * Get all available job categories
 */
router.get('/categories', async (req, res) => {
  try {
    const query = `
      SELECT * FROM job_categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC
    `;

    const result = await pool.query(query);

    res.json({
      categories: result.rows,
      total: result.rows.length
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/jobs-landing/locations
 * Get all available job locations
 */
router.get('/locations', async (req, res) => {
  try {
    const query = `
      SELECT * FROM job_locations 
      WHERE is_active = true 
      ORDER BY name ASC
    `;

    const result = await pool.query(query);

    res.json({
      locations: result.rows,
      total: result.rows.length
    });
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
