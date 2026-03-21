/**
 * Configuration for different environments
 * This file determines which API endpoint to use
 * Automatically detects the environment and sets the correct API URL
 */

(function() {
  'use strict';

  // Auto-detect environment and set API URL
  function getApiUrl() {
    const hostname = window.location.hostname;

    // Production Vercel deployment
    if (hostname.includes('vercel.app')) {
      // Update this with your actual Vercel backend URL
      // Example: if frontend is 'my-app.vercel.app', backend might be 'my-backend.vercel.app'
      if (hostname === 'my-feedback-app.vercel.app') {
        return 'https://my-feedback-backend.vercel.app/api';
      }
      // Generic Vercel fallback - update this
      return 'https://student-feedback-backend.vercel.app/api';
    }

    // Custom domain production
    if (hostname.includes('myschool.com') || hostname.includes('yourdomain.com')) {
      return 'https://api.yourdomain.com/api';
    }

    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return 'http://localhost:3000/api';
    }

    // Fallback to localhost for development
    console.warn('⚠️  Unknown hostname:', hostname, '- using localhost API');
    return 'http://localhost:3000/api';
  }

  // Set API URL globally
  window.API_BASE_URL = getApiUrl();

  console.log('✅ API Configuration loaded');
  console.log('🔗 API URL:', window.API_BASE_URL);
  console.log('🌐 Hostname:', window.location.hostname);
})();
