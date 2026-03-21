// ─────────────────────────────────────────────
// STUDENT FEEDBACK FORM - Node.js/Express Backend
// ─────────────────────────────────────────────
// This server acts as an API gateway for Supabase,
// providing validation, error handling, and CORS support

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase client initialized');

// ─── MIDDLEWARE ───
app.use(cors({
  origin: true, // Allow all origins (Vercel requires this for now)
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ─── VALIDATION FUNCTIONS ───
function validateFeedbackData(data) {
  const errors = [];

  // Required fields
  if (!data.full_name || !data.full_name.trim()) {
    errors.push('Full name is required');
  }
  if (!data.grade) {
    errors.push('Grade/Year is required');
  }
  if (!data.subject) {
    errors.push('Subject/Course is required');
  }
  if (!data.overall_rating || data.overall_rating < 1 || data.overall_rating > 5) {
    errors.push('Overall rating must be between 1 and 5');
  }
  if (!data.liked_most || !data.liked_most.trim()) {
    errors.push('Please share what you liked most');
  }

  // Optional field validation
  if (data.teaching_rating && (data.teaching_rating < 1 || data.teaching_rating > 5)) {
    errors.push('Teaching rating must be between 1 and 5');
  }
  if (data.materials_rating && (data.materials_rating < 1 || data.materials_rating > 5)) {
    errors.push('Materials rating must be between 1 and 5');
  }

  return { isValid: errors.length === 0, errors };
}

// ─── API ROUTES ───

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

/**
 * POST /api/feedback
 * Submit student feedback
 */
app.post('/api/feedback', async (req, res) => {
  try {
    const data = req.body;

    // Validate input data
    const validation = validateFeedbackData(data);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
        message: 'Validation failed'
      });
    }

    // Prepare data for Supabase
    const feedbackData = {
      full_name: data.full_name.trim(),
      student_id: data.student_id?.trim() || null,
      email: data.email?.trim() || null,
      grade: data.grade,
      subject: data.subject,
      overall_rating: parseInt(data.overall_rating),
      teaching_rating: data.teaching_rating ? parseInt(data.teaching_rating) : null,
      materials_rating: data.materials_rating ? parseInt(data.materials_rating) : null,
      mood: data.mood || null,
      enjoyed: Array.isArray(data.enjoyed) ? data.enjoyed : null,
      liked_most: data.liked_most.trim(),
      improvements: data.improvements?.trim() || null,
      additional_comments: data.additional_comments?.trim() || null
    };

    // Insert into Supabase
    const { data: result, error } = await supabase
      .from('student_feedback')
      .insert([feedbackData])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit feedback',
        error: error.message
      });
    }

    console.log('✅ Feedback submitted successfully:', result[0]?.id);
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      id: result[0]?.id
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/feedback
 * Retrieve all feedback (with optional filters)
 */
app.get('/api/feedback', async (req, res) => {
  try {
    const { subject, grade, limit = 100, offset = 0 } = req.query;

    let query = supabase
      .from('student_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply optional filters
    if (subject) {
      query = query.eq('subject', subject);
    }
    if (grade) {
      query = query.eq('grade', grade);
    }

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Supabase query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve feedback',
        error: error.message
      });
    }

    console.log(`✅ Retrieved ${data.length} feedback entries`);
    res.json({
      success: true,
      data,
      count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/feedback/stats
 * Get summary statistics for feedback
 */
app.get('/api/feedback/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_feedback')
      .select('*');

    if (error) {
      console.error('❌ Supabase query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve stats',
        error: error.message
      });
    }

    if (data.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalResponses: 0,
          averageRating: 0,
          ratingDistribution: {},
          bySubject: {},
          byGrade: {}
        }
      });
    }

    // Calculate statistics
    const stats = {
      totalResponses: data.length,
      averageRating: (data.reduce((sum, item) => sum + item.overall_rating, 0) / data.length).toFixed(2),
      ratingDistribution: {},
      bySubject: {},
      byGrade: {}
    };

    // Distribution by rating
    for (let i = 1; i <= 5; i++) {
      stats.ratingDistribution[i] = data.filter(item => item.overall_rating === i).length;
    }

    // Distribution by subject
    data.forEach(item => {
      if (!stats.bySubject[item.subject]) {
        stats.bySubject[item.subject] = 0;
      }
      stats.bySubject[item.subject]++;
    });

    // Distribution by grade
    data.forEach(item => {
      if (!stats.byGrade[item.grade]) {
        stats.byGrade[item.grade] = 0;
      }
      stats.byGrade[item.grade]++;
    });

    console.log('✅ Stats calculated');
    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/feedback/:id
 * Get a single feedback entry by ID
 */
app.get('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('student_feedback')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }
      console.error('❌ Supabase query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve feedback',
        error: error.message
      });
    }

    console.log(`✅ Retrieved feedback: ${id}`);
    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * DELETE /api/feedback/:id
 * Delete a feedback entry by ID
 */
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('student_feedback')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Supabase delete error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete feedback',
        error: error.message
      });
    }

    console.log(`✅ Deleted feedback: ${id}`);
    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ─── ERROR HANDLING ───

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ─── SERVER STARTUP ───
app.listen(PORT, () => {
  console.log(`\n🚀 Student Feedback Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api\n`);
});
