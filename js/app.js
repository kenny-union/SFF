// ─────────────────────────────────────────────
// STUDENT FEEDBACK FORM - App Logic (CLEAN)
// ─────────────────────────────────────────────

// ─── SUPABASE INITIALIZATION ───
const SUPABASE_URL = 'https://ubrjrofmafyuclrqifxa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicmpyb2ZtYWZ5dWNscnFpZnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzA3OTYsImV4cCI6MjA4NzYwNjc5Nn0.R4Alsa_so0ITQpqv5eHYWCKdeU71MBYDsu_nvr3G6BQ';

console.log('🔧 Initializing Supabase client...');

// Store client in global object to avoid redeclaration
if (!window.appState) {
  window.appState = {};
}

if (window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    window.appState.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized');
  } catch (err) {
    console.error('❌ Supabase init error:', err);
  }
} else {
  console.error('❌ Supabase SDK not loaded - check HTML <script> tag');
}

// ─── PROGRESS BAR ───
function updateProgress() {
  const requiredFields = ['name', 'grade', 'subject', 'liked'];
  const overallRating = document.querySelector('input[name="overall"]:checked');

  let filledCount = requiredFields.filter(id => {
    const element = document.getElementById(id);
    return element && element.value.trim() !== '';
  }).length;

  if (overallRating) filledCount++;

  const progressPercentage = Math.min(100, Math.round((filledCount / 5) * 100));
  document.getElementById('progressBar').style.width = progressPercentage + '%';
}

// Attach progress tracking to all form inputs
document.querySelectorAll('input, select, textarea').forEach(element => {
  element.addEventListener('change', updateProgress);
  element.addEventListener('input', updateProgress);
});

// ─── CHARACTER COUNTER ───
function updateCharCount(inputElement, countElementId) {
  const countElement = document.getElementById(countElementId);
  if (countElement) {
    countElement.textContent = inputElement.value.length;
  }
}

// Attach character counters
const textareas = {
  'liked': 'likedCount',
  'improve': 'improveCount',
  'comments': 'commentsCount'
};

Object.keys(textareas).forEach(fieldId => {
  const element = document.getElementById(fieldId);
  if (element) {
    element.addEventListener('input', function() {
      updateCharCount(this, textareas[fieldId]);
    });
  }
});

// ─── FORM VALIDATION ───
function validateForm() {
  const name = document.getElementById('name').value.trim();
  const grade = document.getElementById('grade').value;
  const subject = document.getElementById('subject').value;
  const overallRating = document.querySelector('input[name="overall"]:checked');
  const liked = document.getElementById('liked').value.trim();

  const errors = [];

  if (!name) {
    errors.push('Please enter your full name.');
  }
  if (!grade) {
    errors.push('Please select your grade / year.');
  }
  if (!subject) {
    errors.push('Please select a subject / course.');
  }
  if (!overallRating) {
    errors.push('Please rate your overall experience.');
  }
  if (!liked) {
    errors.push('Please share what you liked most.');
  }

  return { isValid: errors.length === 0, errors };
}

// ─── COLLECT FORM DATA ───
function collectFormData() {
  const enjoyed = [];
  document.querySelectorAll('input[name="enjoyed"]:checked').forEach(checkbox => {
    enjoyed.push(checkbox.value);
  });

  return {
    full_name: document.getElementById('name').value.trim(),
    student_id: document.getElementById('studentId').value.trim() || null,
    email: document.getElementById('email').value.trim() || null,
    grade: document.getElementById('grade').value,
    subject: document.getElementById('subject').value,
    overall_rating: parseInt(document.querySelector('input[name="overall"]:checked').value),
    teaching_rating: document.querySelector('input[name="teaching"]:checked')
      ? parseInt(document.querySelector('input[name="teaching"]:checked').value)
      : null,
    materials_rating: document.querySelector('input[name="materials"]:checked')
      ? parseInt(document.querySelector('input[name="materials"]:checked').value)
      : null,
    mood: document.querySelector('input[name="mood"]:checked')?.value || null,
    enjoyed: enjoyed.length > 0 ? enjoyed : null,
    liked_most: document.getElementById('liked').value.trim(),
    improvements: document.getElementById('improve').value.trim() || null,
    additional_comments: document.getElementById('comments').value.trim() || null
  };
}

// ─── EMAIL VALIDATION ───
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ─── FORM SUBMIT HANDLER ───
document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  console.log('📤 Form submission started');

  // Validate
  const validation = validateForm();
  if (!validation.isValid) {
    console.warn('Validation failed:', validation.errors);
    alert('❌ Please fix these errors:\n\n' + validation.errors.join('\n'));
    return;
  }

  // Email validation
  const emailField = document.getElementById('email').value.trim();
  if (emailField && !validateEmail(emailField)) {
    alert('❌ Please enter a valid email address.');
    return;
  }

  // Prepare button
  const submitBtn = document.querySelector('.btn-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.textContent = '⏳ Submitting…';
  submitBtn.disabled = true;

  try {
    // Check Supabase
    if (!window.appState.supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Collect data
    const formData = collectFormData();
    console.log('📋 Data collected:', formData);

    // Insert
    console.log('🔄 Inserting into Supabase...');
    const { data, error } = await window.appState.supabase
      .from('student_feedback')
      .insert([formData])
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      
      // Helpful error messages
      let msg = error.message || JSON.stringify(error);
      if (error.code === 'PGRST116') {
        msg = 'Table not found. Run schema.sql in Supabase SQL Editor.';
      } else if (msg.includes('policy')) {
        msg = 'Permission denied. Check RLS policies.';
      }
      
      alert('❌ Error: ' + msg);
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }

    console.log('✅ Success! Data:', data);
    alert('✅ Thank you! Feedback submitted successfully.');
    showSuccessScreen();

  } catch (err) {
    console.error('❌ Error:', err);
    alert('❌ ' + err.message);
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// ─── SUCCESS SCREEN ───
function showSuccessScreen() {
  document.getElementById('formContent').classList.add('hide');
  document.getElementById('successScreen').classList.add('show');
}

// ─── RESET FORM ───
function resetForm() {
  document.getElementById('feedbackForm').reset();
  document.getElementById('successScreen').classList.remove('show');
  document.getElementById('formContent').classList.remove('hide');
  document.getElementById('progressBar').style.width = '0%';

  // Reset character counters
  ['likedCount', 'improveCount', 'commentsCount'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = '0';
    }
  });

  // Reset submit button
  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.innerHTML = '<span>Submit Feedback</span> <span>🚀</span>';
  submitBtn.disabled = false;
}

// ─── INITIALIZE ON PAGE LOAD ───
document.addEventListener('DOMContentLoaded', function() {
  // Initialize character counts
  ['likedCount', 'improveCount', 'commentsCount'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = '0';
    }
  });

  // Set initial progress
  updateProgress();

  console.log('✓ Form initialized successfully');
});
