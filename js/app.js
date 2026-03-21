// ─────────────────────────────────────────────
// STUDENT FEEDBACK FORM - App Logic (CLEAN)
// ─────────────────────────────────────────────

// ─── BACKEND API CONFIGURATION ───
// Change this URL when deploying backend to production
const API_BASE_URL = 'http://localhost:3000/api';
// For production: 'https://your-deployed-backend.com/api'

console.log('🔧 Connecting to backend at:', API_BASE_URL);

// Store config in global object
if (!window.appState) {
  window.appState = {};
}
window.appState.apiUrl = API_BASE_URL;

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
    // Collect data
    const formData = collectFormData();
    console.log('📋 Data collected:', formData);

    // Send to backend API
    console.log('🔄 Sending to backend...');
    const response = await fetch(`${window.appState.apiUrl}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Backend error:', result);
      
      // Handle validation errors
      if (result.errors && Array.isArray(result.errors)) {
        alert('❌ Please fix these errors:\n\n' + result.errors.join('\n'));
      } else {
        alert('❌ Error: ' + (result.message || 'Failed to submit feedback'));
      }
      
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }

    console.log('✅ Success! Response:', result);
    alert('✅ Thank you! Feedback submitted successfully.');
    showSuccessScreen();

  } catch (err) {
    console.error('❌ Error:', err);
    alert('❌ ' + (err.message || 'Failed to submit feedback. Make sure the backend server is running!'));
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
