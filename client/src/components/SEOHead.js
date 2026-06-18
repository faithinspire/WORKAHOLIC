/**
 * SEOHead Component
 * Injects meta tags and JSON-LD into the document head
 * Usage: <SEOHead title={...} description={...} jsonLd={...} />
 */

import React, { useEffect } from 'react';

export default function SEOHead({
  title = 'FaithJobs - Teaching Jobs in Nigeria',
  description = 'Find the best teaching and education jobs in Nigeria',
  keywords = 'jobs, teaching, education, Nigeria, recruiter',
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterCreator = '@FaithJobsNG',
  jsonLd,
  canonical
}) {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Set meta tags
    const setMetaTag = (name, property, content) => {
      let meta = document.querySelector(`meta[${property}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(property, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Standard meta tags
    setMetaTag('description', 'name', description);
    setMetaTag('keywords', 'name', keywords);
    setMetaTag('viewport', 'name', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    setMetaTag('og:title', 'property', ogTitle || title);
    setMetaTag('og:description', 'property', ogDescription || description);
    setMetaTag('og:site_name', 'property', 'FaithJobs');
    setMetaTag('og:type', 'property', 'website');

    if (ogImage) {
      setMetaTag('og:image', 'property', ogImage);
      setMetaTag('og:image:width', 'property', '1200');
      setMetaTag('og:image:height', 'property', '630');
      setMetaTag('og:image:type', 'property', 'image/png');
    }

    if (ogUrl) {
      setMetaTag('og:url', 'property', ogUrl);
    }

    // Twitter Card tags
    setMetaTag('twitter:card', 'name', twitterCard);
    setMetaTag('twitter:title', 'name', ogTitle || title);
    setMetaTag('twitter:description', 'name', ogDescription || description);
    
    if (ogImage) {
      setMetaTag('twitter:image', 'name', ogImage);
    }
    
    setMetaTag('twitter:creator', 'name', twitterCreator);
    setMetaTag('twitter:site', 'name', twitterCreator);

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Language
    setMetaTag('language', 'name', 'English');
    setMetaTag('author', 'name', 'FaithJobs');

    // Inject JSON-LD structured data
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]');
      
      if (script) {
        script.remove();
      }

      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      // Optional: Remove meta tags on unmount if needed
      // This is usually not necessary as the next component will override
    };
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    twitterCreator,
    jsonLd,
    canonical
  ]);

  // Component doesn't render anything visible
  return null;
}
