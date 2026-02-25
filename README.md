# 📚 Student Feedback System

A modern, interactive web application for collecting structured academic feedback using a notebook-themed interface. Built with **HTML5**, **CSS3**, **Vanilla JavaScript**, and **Supabase**.

---

## 🎯 Features

### ✨ Interactive UI
- **Notebook-style card layout** with decorative hole punches and margin lines
- **Animated progress bar** tracking form completion
- **Star rating system** (1-5 stars) for multiple dimensions
- **Emoji mood selector** for quick emotional feedback
- **Custom checkbox UI** for multi-select options
- **Live character counter** for text feedback fields
- **Success state screen** with celebration animation
- **Fully responsive design** optimized for mobile and desktop

### 🔐 Data Collection
- **Student Information**: Name, ID, Email, Grade, Subject
- **Ratings**: Overall experience, Teaching quality, Course materials
- **Experience**: Mood, Enjoyed aspects (checkboxes)
- **Feedback**: What you liked most, Improvements, Additional comments
- **Metadata**: Automatic timestamp on submission

### ✅ Smart Validation
- **Required field enforcement** (Name, Grade, Subject, Overall Rating, Feedback)
- **Email format validation** when provided
- **User-friendly error messages**
- **No page reload** on validation failure
- **Progress tracking** for better UX

### 🚀 Backend Integration
- **Supabase PostgreSQL database** for secure data storage
- **Row-Level Security (RLS)** policies
- **Public insert access** for anonymous submissions
- **Authenticated read access** for admin dashboards
- **Automatic timestamps** for all submissions

---

## 📁 Project Structure

```
student-feedback-system/
│
├── index.html                 # Main form page
├── css/
│   └── styles.css            # All styling & responsive design
├── js/
│   └── app.js                # Form logic & Supabase integration
├── supabase/
│   └── schema.sql            # Database schema & RLS policies
├── .env.example              # Environment variable template
├── README.md                 # This file
└── TODO.md                   # Phase tracking
```

---

## 🚀 Quick Start

### 1️⃣ Prerequisites
- A code editor (VS Code recommended)
- A Supabase account (free tier available)
- Modern web browser

### 2️⃣ Supabase Setup

**Step 1: Create a Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Create a new project
4. Wait for initialization (~2 minutes)

**Step 2: Create the Database Table**
1. Go to the **SQL Editor** tab
2. Click **New Query**
3. Copy the contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run**

**Step 3: Get Your Credentials**
1. Go to **Settings > API**
2. Copy your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

**Step 4: Configure Environment**
1. Rename `.env.example` to `.env`
2. Replace placeholders with your credentials:
   ```
   SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
   ```

### 3️⃣ Run Locally

**Using a Local Server:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if installed)
npx http-server -p 8000
```

Then open: **http://localhost:8000**

**Or use VS Code Live Server:**
1. Install the "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

---

## 📝 Form Fields

### Student Information Section
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Full Name | Text | ✅ Yes | 3-100 characters |
| Student ID | Text | ❌ No | For identification |
| Email | Email | ❌ No | Must be valid format |
| Grade / Year | Select | ✅ Yes | 9-12 or University years |
| Subject / Course | Select | ✅ Yes | 8 default options |

### Ratings Section
| Field | Scale | Required | Notes |
|-------|-------|----------|-------|
| Overall Experience | 1-5 stars | ✅ Yes | Required rating |
| Teaching Quality | 1-5 stars | ❌ No | Optional |
| Course Materials | 1-5 stars | ❌ No | Optional |

### Experience Section
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Mood | Radio (5 options) | ❌ No | Happy, Neutral, Sad, Excited, Stressed |
| Enjoyed | Checkboxes | ❌ No | Multiple selections allowed |

### Feedback Section
| Field | Type | Required | Max Length |
|-------|------|----------|-----------|
| What you liked most | Textarea | ✅ Yes | 500 chars |
| Improvements | Textarea | ❌ No | 500 chars |
| Additional Comments | Textarea | ❌ No | 500 chars |

---

## 🔧 Customization

### Change Subject Options
Edit `index.html` (lines ~95-103):
```html
<select id="subject" required>
  <option value="">Select subject…</option>
  <option value="Your Subject">Your Subject</option>
  <!-- Add more options -->
</select>
```

### Change Grade/Year Options
Edit `index.html` (lines ~83-92):
```html
<select id="grade" required>
  <option value="">Select grade…</option>
  <option value="Custom Grade">Custom Grade</option>
  <!-- Add more options -->
</select>
```

### Change Colors
Edit `css/styles.css` (lines 8-20):
```css
:root {
  --amber: #e8850a;      /* Primary accent */
  --teal: #2a8a8a;       /* Secondary accent */
  --red: #e05252;        /* Error color */
  --green: #3a9b6f;      /* Success color */
  /* ... and more */
}
```

### Adjust Theme
- **Colors**: Modify CSS variables in `:root`
- **Fonts**: Change from Caveat/Nunito in `index.html` head
- **Layout**: Adjust padding/margins in `css/styles.css`
- **Animations**: Modify `@keyframes` in `css/styles.css`

---

## 📊 Database Schema

### Student Feedback Table

**Columns:**
- `id` (UUID, Primary Key) - Auto-generated
- `created_at` (Timestamp) - Submission time
- `full_name` (Text, Required) - Student name
- `student_id` (Text) - Optional identifier
- `email` (Text) - Optional email
- `grade` (Text, Required) - Grade/Year
- `subject` (Text, Required) - Course name
- `overall_rating` (Integer 1-5, Required) - Main rating
- `teaching_rating` (Integer 1-5) - Optional
- `materials_rating` (Integer 1-5) - Optional
- `mood` (Text) - Emoji mood value
- `enjoyed` (Text Array) - Checked items
- `liked_most` (Text, Required) - Main feedback
- `improvements` (Text) - Suggestions
- `additional_comments` (Text) - Extra feedback

**Indexes:**
- `created_at` (for chronological queries)
- `subject` (for filtering by course)
- `grade` (for filtering by grade level)

---

## 🔐 Security

### Built-in Protections
- **Row-Level Security (RLS)** enabled on database
- **Public Insert** policy for anonymous submissions
- **Email validation** on client side
- **Input sanitization** via JavaScript

### Additional Recommendations
- Enable CAPTCHA in production
- Implement rate limiting via Supabase Edge Function
- Use HTTPS for all deployments
- Regularly audit feedback submissions
- Mask sensitive student data in exports

---

## 🌐 Deployment

### Option 1: Netlify
```bash
# Connect your GitHub repo to Netlify
# Set environment variables in Netlify dashboard:
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

### Option 2: Vercel
```bash
# Deploy with Vercel CLI or GitHub integration
vercel
# Set environment variables in Vercel dashboard
```

### Option 3: GitHub Pages
```bash
# Push to GitHub and enable Pages
# Note: Requires backend API for form submission (can't use GH Pages alone)
```

### Option 4: Self-Hosted
```bash
# Deploy to your own server with Node.js/Python
# Keep .env file with credentials secure
# Use proper HTTPS/SSL certificates
```

---

## 📈 Admin Dashboard (Future Phase)

To view submissions, create an admin page:

```javascript
const { data, error } = await supabase
  .from('student_feedback')
  .select('*')
  .order('created_at', { ascending: false });

// Calculate stats
const avgRating = data.reduce((a, b) => a + b.overall_rating, 0) / data.length;
const moodCounts = {};
data.forEach(item => {
  moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
});
```

---

## 🐛 Troubleshooting

### Form not submitting?
1. Check browser console for errors (F12)
2. Verify Supabase credentials in environment
3. Check that RLS policy allows inserts
4. Ensure email format is valid if provided

### Styling looks broken?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Verify `css/styles.css` is linked in `index.html`
3. Check for CSS file path errors in browser network tab

### Data not appearing in Supabase?
1. Check that database table exists
2. Verify credentials in `.env`
3. Check Supabase dashboard > Auth > Policies
4. Look for error messages in browser console

### CORS errors?
- Supabase should handle CORS by default
- If issues persist, check project settings in Supabase

---

## 📚 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Supabase (PostgreSQL) |
| **Auth** | Supabase Anonymous/Public |
| **Hosting** | Any static host (Netlify, Vercel, etc.) |
| **SDK** | @supabase/supabase-js v2 |

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- Dark mode toggle
- Multi-language support
- Advanced analytics dashboard
- Email notifications on submission
- Import/Export functionality

---

## 💬 Support

For issues or questions:
1. Check the [Supabase docs](https://supabase.com/docs)
2. Review the TODO.md for planned features
3. Check browser console for error messages
4. Verify all setup steps were completed

---

**Built with ❤️ for educators and students**
