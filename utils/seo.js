/**
 * SEO Utilities Module
 * Handles JSON-LD generation, slug creation, and SEO metadata
 */

/**
 * Generate URL-friendly slug from job title and company
 * @param {string} jobTitle - Job title
 * @param {string} companyName - Company name
 * @returns {string} - Slug suitable for URLs
 */
function generateSlug(jobTitle, companyName) {
  if (!jobTitle || !companyName) {
    throw new Error('Job title and company name are required for slug generation');
  }

  const combined = `${companyName}-${jobTitle}`;
  return combined
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .slice(0, 200); // Limit length
}

/**
 * Generate Google for Jobs JSON-LD structured data
 * Reference: https://schema.org/JobPosting
 * @param {object} job - Job object from database
 * @returns {object} - Valid JSON-LD object
 */
function generateJobPostingJsonLd(job) {
  if (!job.id || !job.title || !job.company_name) {
    throw new Error('Job must have id, title, and company_name');
  }

  // Determine job location type
  const locationTypeMapping = {
    'Remote': 'TELECOMMUTE',
    'On-site': 'PHYSICAL',
    'Hybrid': 'MULTIPLE'
  };

  const jobLocationType = locationTypeMapping[job.work_location_type] || 'MULTIPLE';

  // Build base salary info
  const baseSalaryObj = {
    '@type': 'PriceSpecification',
    'priceCurrency': job.currency || 'NGN'
  };

  if (job.base_salary_min && job.base_salary_max) {
    baseSalaryObj.price = `${job.base_salary_min}-${job.base_salary_max}`;
  } else if (job.base_salary_min) {
    baseSalaryObj.price = job.base_salary_min.toString();
  } else if (job.base_salary_max) {
    baseSalaryObj.price = job.base_salary_max.toString();
  }

  // Build job location
  const jobLocationObj = {
    '@type': 'Place',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'NG'
    }
  };

  if (job.location_state) {
    jobLocationObj.address.addressRegion = job.location_state;
  }

  if (job.location_lga) {
    jobLocationObj.address.addressLocality = job.location_lga;
  }

  // Build the JSON-LD object
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.description || '',
    'datePosted': job.date_posted || new Date().toISOString(),
    'validThrough': job.valid_through || addDays(new Date(), 90).toISOString(),
    'employmentType': job.job_type || 'FULL_TIME',
    'jobLocationType': jobLocationType,
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.company_name,
      'sameAs': job.company_website || undefined,
      'logo': job.company_logo_url || undefined
    },
    'jobLocation': jobLocationObj,
    'applicantLocationRequirements': {
      '@type': 'Country',
      'name': 'NG'
    }
  };

  // Add salary info if available
  if (baseSalaryObj.price) {
    jsonLd.baseSalary = baseSalaryObj;
  }

  // Add hiring manager info if available
  if (job.hiring_manager_name) {
    jsonLd.hiringManager = {
      '@type': 'Person',
      'name': job.hiring_manager_name,
      'email': job.hiring_manager_email || undefined
    };
  }

  // Add required qualifications
  if (job.education_level) {
    jsonLd.educationRequirements = {
      '@type': 'EducationalOccupationalCredential',
      'credentialCategory': job.education_level
    };
  }

  // Add application URL if available
  if (job.application_url) {
    jsonLd.url = job.application_url;
  }

  // Clean up undefined values
  cleanObject(jsonLd);

  return jsonLd;
}

/**
 * Generate Open Graph meta tags for social sharing
 * @param {object} job - Job object from database
 * @param {string} baseUrl - Base URL of the site
 * @returns {object} - Object with OG meta tags
 */
function generateOpenGraphMeta(job, baseUrl) {
  const jobUrl = `${baseUrl}/jobs/${job.slug || job.id}`;
  const salaryText = job.base_salary_min && job.base_salary_max
    ? `${job.base_salary_min.toLocaleString()}-${job.base_salary_max.toLocaleString()} ${job.currency || 'NGN'}`
    : 'Competitive';

  const description = `${job.title} at ${job.company_name} | ${salaryText}`;
  const ogImage = job.og_image_url || generateDefaultOGImage(job);

  return {
    'og:title': job.seo_title || job.title,
    'og:description': job.seo_description || description,
    'og:image': ogImage,
    'og:url': jobUrl,
    'og:type': 'website',
    'og:site_name': 'FaithJobs',
    'twitter:card': 'summary_large_image',
    'twitter:title': job.seo_title || job.title,
    'twitter:description': job.seo_description || description,
    'twitter:image': ogImage
  };
}

/**
 * Generate Twitter Card meta tags
 * @param {object} job - Job object from database
 * @param {string} baseUrl - Base URL of the site
 * @returns {object} - Object with Twitter meta tags
 */
function generateTwitterCardMeta(job, baseUrl) {
  const jobUrl = `${baseUrl}/jobs/${job.slug || job.id}`;
  const salaryText = job.base_salary_min && job.base_salary_max
    ? `${job.base_salary_min.toLocaleString()}-${job.base_salary_max.toLocaleString()} ${job.currency || 'NGN'}`
    : 'Competitive';

  const twitterDescription = `${job.title} at ${job.company_name} | ${salaryText}`;

  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': job.seo_title || job.title,
    'twitter:description': twitterDescription,
    'twitter:image': job.og_image_url || generateDefaultOGImage(job),
    'twitter:url': jobUrl,
    'twitter:site': '@FaithJobsNG'
  };
}

/**
 * Generate programmatic SEO page title and description
 * @param {object} filters - Filter object (category, location, role)
 * @returns {object} - Title and description for the page
 */
function generateProgrammaticSeoMeta(filters) {
  const { category, location, role, level } = filters;

  let title = 'Teaching Jobs in Nigeria | FaithJobs';
  let description = 'Find the best teaching and education jobs in Nigeria with FaithJobs';

  if (location && !role && !category) {
    title = `Teaching Jobs in ${location} | FaithJobs`;
    description = `Browse teaching positions in ${location}, Nigeria. Get hired today!`;
  }

  if (role && !location && !category) {
    title = `${role} Jobs in Nigeria | FaithJobs`;
    description = `Find ${role} positions in Nigeria. Apply to top ${role} roles on FaithJobs.`;
  }

  if (category && !location && !role) {
    title = `${category} Jobs in Nigeria | FaithJobs`;
    description = `Browse ${category} positions in Nigeria on FaithJobs - your job board.`;
  }

  if (role && location) {
    title = `${role} Jobs in ${location} | FaithJobs`;
    description = `Find ${role} positions in ${location}, Nigeria. Apply to remote and on-site roles.`;
  }

  if (category && location) {
    title = `${category} Jobs in ${location} | FaithJobs`;
    description = `Browse ${category} opportunities in ${location}, Nigeria on FaithJobs.`;
  }

  if (role && category) {
    title = `${role} ${category} Jobs | FaithJobs`;
    description = `Find ${role} positions in ${category} on FaithJobs. Hire top talent today.`;
  }

  if (role && category && location) {
    title = `${role} ${category} Jobs in ${location} | FaithJobs`;
    description = `Browse ${role} opportunities in ${category} located in ${location}, Nigeria.`;
  }

  if (level) {
    title = `${level} Level ${title}`;
    description = `Find ${level} level positions. ${description}`;
  }

  return {
    title: title.slice(0, 60),
    description: description.slice(0, 160)
  };
}

/**
 * Generate default OG image URL (text-based image placeholder)
 * In production, this could use a service like og-image.vercel.app
 * @param {object} job - Job object
 * @returns {string} - Image URL
 */
function generateDefaultOGImage(job) {
  // Using placeholder service (implement your own image generation in production)
  const text = encodeURIComponent(
    `${job.title}\nat ${job.company_name}`
  );
  
  // Option 1: Use a placeholder service
  return `https://og-image.vercel.app/${text}.png?theme=dark&md=1&fontSize=100px`;
  
  // Option 2: Return your default image
  // return `${process.env.SITE_URL}/images/default-job-og.png`;
}

/**
 * Helper: Remove undefined/null values from object
 * @param {object} obj - Object to clean
 */
function cleanObject(obj) {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      cleanObject(obj[key]);
    }
  }
}

/**
 * Helper: Add days to date
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} - New date
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Generate sharing text for social platforms
 * @param {object} job - Job object
 * @param {string} platform - Platform name (LinkedIn, Twitter, Email, WhatsApp)
 * @returns {object} - Object with sharing URLs and text
 */
function generateSharingTemplates(job, baseUrl) {
  const jobUrl = `${baseUrl}/jobs/${job.slug || job.id}`;
  const jobTitle = job.title;
  const companyName = job.company_name;

  const templates = {
    linkedin: {
      text: `Exciting opportunity! 🎯\n\n${jobTitle} at ${companyName}\n\nLocation: ${job.work_location_type}\nSalary: ${job.base_salary_min ? `${job.base_salary_min}-${job.base_salary_max} ${job.currency}` : 'Competitive'}\n\nApply now on FaithJobs: ${jobUrl}\n\n#Hiring #Jobs #Nigeria`,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`
    },
    twitter: {
      text: `🚀 New job alert! ${jobTitle} at ${companyName}\n\n✓ ${job.work_location_type}\n✓ Competitive salary\n\nCheck it out on FaithJobs: ${jobUrl}\n\n#Jobs #Hiring #Nigeria`,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${jobTitle} at ${companyName} - ${jobUrl}`)}&hashtags=jobs,hiring,nigeria`
    },
    whatsapp: {
      text: `Check out this job! 👇\n\n${jobTitle}\n${companyName}\n\nLocation: ${job.work_location_type}\n\n${jobUrl}`,
      url: `https://wa.me/?text=${encodeURIComponent(`${jobTitle} at ${companyName} - ${jobUrl}`)}`
    },
    email: {
      subject: `Awesome Job: ${jobTitle} at ${companyName}`,
      body: `I found this great job opportunity on FaithJobs:\n\n${jobTitle}\nCompany: ${companyName}\nLocation: ${job.work_location_type}\nSalary: ${job.base_salary_min ? `${job.base_salary_min}-${job.base_salary_max}` : 'Competitive'}\n\nApply here: ${jobUrl}`,
      url: `mailto:?subject=${encodeURIComponent(`Awesome Job: ${jobTitle} at ${companyName}`)}&body=${encodeURIComponent(`I found this great job opportunity on FaithJobs:\n\n${jobTitle}\nCompany: ${companyName}\nLocation: ${job.work_location_type}\n\nApply here: ${jobUrl}`)}`
    },
    directLink: {
      text: jobUrl,
      url: jobUrl
    }
  };

  return templates;
}

module.exports = {
  generateSlug,
  generateJobPostingJsonLd,
  generateOpenGraphMeta,
  generateTwitterCardMeta,
  generateProgrammaticSeoMeta,
  generateDefaultOGImage,
  generateSharingTemplates
};
