# 📚 Student Feedback System

A modern, interactive web application for collecting structured academic feedback using a notebook-themed interface. Built with **HTML5**, **CSS3**, **JavaScript**, **Node.js/Express**, and **Supabase**.

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

### 🔐 Data Collection & Security
- **Student Information**: Name, ID, Email, Grade, Subject
- **Ratings**: Overall experience, Teaching quality, Course materials
- **Experience**: Mood, Enjoyed aspects (checkboxes)
- **Feedback**: What you liked most, Improvements, Additional comments
- **Metadata**: Automatic timestamp on submission
- **Secure Backend**: All credentials kept server-side (not exposed to frontend)

### ✅ Smart Validation
- **Client-side validation** for quick user feedback
- **Server-side validation** for security
- **Required field enforcement** (Name, Grade, Subject, Overall Rating, Feedback)
- **Email format validation** when provided
- **User-friendly error messages**
- **No page reload** on validation failure

### 🚀 Backend Integration
- **Node.js/Express API server** for request handling
- **Supabase PostgreSQL database** for secure data storage
- **Row-Level Security (RLS)** policies
- **CORS support** for frontend communication
- **Production-ready error handling**
- **Comprehensive logging**

### 📊 Admin Dashboard
- **Real-time feedback viewer**
- **Search by student name**
- **Advanced filtering** (subject, grade, rating)
- **Export to CSV**
- **Admin authentication**
- **Delete management**
- **Statistics & analytics**

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

This project now includes a **Node.js/Express backend** for production deployment. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete deployment instructions.

### Quick Deployment (Vercel - Recommended)

**1. Deploy Backend:**
```bash
# Push to GitHub, then:
# 1. Go to vercel.com
# 2. Import repository
# 3. Select 'backend' folder
# 4. Add environment variables (SUPABASE_URL, SUPABASE_KEY)
# 5. Deploy
```

**2. Update Frontend:**
```javascript
// Edit js/config.js with your backend URL
if (hostname === 'my-feedback-app.vercel.app') {
  return 'https://my-feedback-backend.vercel.app/api';
}
```

**3. Deploy Frontend:**
```bash
# Same Vercel process for root directory
```

### Deployment Options

| Option | Best For | Cost | Setup Time |
|--------|----------|------|------------|
| **Vercel** | Full Stack | Free tier | 5 mins |
| **Railway** | Full Stack | $5/mo | 10 mins |
| **Heroku** | Full Stack | $7/mo | 10 mins |
| **Docker** | Full Control | Varies | 20 mins |

### Configuration

Your app auto-detects the environment using `js/config.js`:

| Environment | API Endpoint |
|-------------|-------------|
| Local Dev | `http://localhost:3000/api` |
| Vercel | Automatically detected |
| Custom Domain | Update config.js |

### Security Features

- ✅ Supabase credentials server-side only
- ✅ Input validation on client and server
- ✅ HTTPS enforced
- ✅ CORS properly configured
- ✅ Environment variables for secrets
- ✅ Production error handling

See [SECURITY.md](./SECURITY.md) for detailed security information.

---

## 📊 Admin Dashboard

View, search, and manage feedback submissions:

1. Open `dashboard.html`
2. Click "Admin Login" button
3. Enter password (shown on modal)
4. View all feedback in real-time
5. Search by student name
6. Export to CSV
7. Delete submissions (admin only)

**Default Password**: `admin123` (change in production!)

---

## 📈 API Endpoints

The backend provides these REST endpoints:

```
POST   /api/feedback          - Submit new feedback
GET    /api/feedback          - Get all feedback (with filters)
GET    /api/feedback/stats    - Get analytics
GET    /api/feedback/:id      - Get single feedback
DELETE /api/feedback/:id      - Delete feedback (admin)
GET    /api/health            - Health check
```

Full API docs: [backend/README.md](./backend/README.md)

---

## 🚀 Getting Started (Local Development)

### 1. Clone & Install

```bash
# Frontend dependencies (none needed - it's static HTML/JS)
# Backend dependencies
cd backend
npm install
```

### 2. Configure Environment

```bash
# Backend configuration
cd backend
cp .env.example .env

# Edit .env with your Supabase credentials:
# SUPABASE_URL=...
# SUPABASE_KEY=...
```

### 3. Start Backend Server

```bash
cd backend
npm start
# Backend runs at http://localhost:3000
```

### 4. Open Frontend

```bash
# Open in browser:
http://localhost:5500  (if using VS Code Live Server)
# or
file:///path/to/index.html
```

### 5. Test

1. Submit a form entry
2. Check backend logs in terminal
3. View feedback in `dashboard.html`
4. Verify in Supabase dashboard

---

## 🔌 Local Development Mode

For auto-reloading backend during development:

```bash
cd backend
npm run dev
```

Requires `nodemon` (already installed).

---

## 📁 Project Files Guide

```
student-feedback-system/
│
├── 📄 index.html              # Form submission page
├── 📄 dashboard.html          # Admin feedback viewer
├── 📄 test.html               # Testing page
│
├── 📁 css/
│   └── styles.css             # All styling
│
├── 📁 js/
│   ├── config.js              # Environment detection
│   └── app.js                 # Form & API logic
│
├── 📁 backend/                # Node.js Express server
│   ├── server.js              # Main API
│   ├── package.json           # Dependencies
│   ├── vercel.json            # Vercel config
│   ├── .env                   # Secrets (not in git)
│   ├── .env.example           # Template
│   └── README.md              # Backend docs
│
├── 📁 supabase/
│   └── schema.sql             # Database schema
│
├── 📖 QUICK_START.md          # 5-minute setup
├── 📖 VERCEL_DEPLOYMENT.md    # Production deployment
├── 📖 BACKEND_SETUP.md        # Backend guide
├── 📖 DEPLOYMENT.md           # Config guide
├── 📖 SECURITY.md             # Security guide
└── 📖 README.md               # This file
```

---

## 🐛 Troubleshooting

### Frontend Issues

**"Cannot connect to backend"**
- Ensure `npm start` is running in backend folder
- Check `http://localhost:3000/api/health` in browser
- Verify API_BASE_URL in js/config.js

**"Form validation fails"**
- Fill all required fields
- Check browser console (F12) for errors
- Check backend logs in terminal

**"Dashboard shows no feedback"**
- Backend must be running
- Data must exist in Supabase
- Check network tab (F12) for API errors

### Backend Issues

**"Port 3000 already in use"**
```bash
# Use a different port
PORT=3001 npm start
# Then update config.js
```

**"Supabase connection error"**
- Verify SUPABASE_URL in .env
- Verify SUPABASE_KEY in .env
- Check that credentials are correct

**"npm install fails"**
```bash
# Clear cache and try again
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**"Table not found"**
- Run `supabase/schema.sql` in Supabase SQL editor
- Check that table `student_feedback` exists

**"RLS policy denies access"**
- Check Supabase policies allow public insert
- See `supabase/schema.sql` for correct policies

---

## 📚 Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Environment variables, Basic auth |
| **Hosting** | Vercel, Railway, Heroku, or self-hosted |
| **APIs** | REST with JSON |

---

## 📖 Documentation

- [QUICK_START.md](./QUICK_START.md) - 5-minute local setup
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Deploy to production
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Backend configuration
- [SECURITY.md](./SECURITY.md) - Security best practices
- [backend/README.md](./backend/README.md) - API documentation

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
