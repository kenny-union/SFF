# Backend Setup Guide

Complete step-by-step guide to set up and run the Node.js/Express backend for the Student Feedback Form project.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Running Locally](#running-locally)
4. [Frontend Configuration](#frontend-configuration)
5. [Deployment Options](#deployment-options)
6. [Troubleshooting](#troubleshooting)

## Quick Start

```bash
cd backend
npm install
npm start
```

Backend will run at `http://localhost:3000/api`

## Detailed Setup

### Step 1: Verify Prerequisites

Check that you have Node.js installed:
```bash
node --version  # Should be 16.0.0 or higher
npm --version   # Should be 7.0.0 or higher
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### Step 2: Navigate to Backend Directory

```bash
cd backend
```

You should see these files:
```
backend/
├── server.js
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs:
- `express`: Web framework
- `cors`: CORS support
- `dotenv`: Environment variable management
- `@supabase/supabase-js`: Supabase client library
- `nodemon`: Development server with auto-reload

### Step 4: Verify Environment Configuration

The `.env` file is already populated with your Supabase credentials.

To use different credentials, edit `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anonymous-key-here
PORT=3000
NODE_ENV=development
```

⚠️ **Important**: Never commit `.env` to version control. Use `.env.example` as template.

## Running Locally

### Production Mode (single run)
```bash
npm start
```

Output:
```
🚀 Student Feedback Backend running on port 3000
📝 Environment: development
🔗 API Base: http://localhost:3000/api
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

The server auto-restarts when you save file changes.

### Test the Backend

Open a new terminal and test:

**Health check:**
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","message":"Backend server is running"}
```

**Submit test feedback:**
```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Student",
    "grade": "10",
    "subject": "Math",
    "overall_rating": 5,
    "liked_most": "Great class!"
  }'
```

**Get all feedback:**
```bash
curl http://localhost:3000/api/feedback
```

## Frontend Configuration

### For Local Testing

Update `js/app.js` to use localhost backend:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

This is already set as the default, so no changes needed for local testing.

### For Production Deployment

After deploying backend, update `js/app.js`:

```javascript
const API_BASE_URL = 'https://your-deployed-backend.com/api';
```

Options:
- **Vercel**: `https://your-project.vercel.app/api`
- **Heroku**: `https://your-app.herokuapp.com/api`
- **Railway**: `https://your-app.railway.app/api`
- **Custom Domain**: `https://api.yourdomain.com`

## Deployment Options

### Option 1: Vercel (Recommended)

**Setup:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New" → "Project"
4. Import your repository
5. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `NODE_ENV=production`
6. Deploy

**Frontend update:**
```javascript
const API_BASE_URL = 'https://[your-project].vercel.app/api';
```

### Option 2: Railway

**Setup:**
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → Import from GitHub
4. Add environment variables
5. Deploy

**Access backend:**
```
https://[railway-domain]/api
```

### Option 3: Heroku

**Setup:**
```bash
npm install -g heroku
heroku login
heroku create your-app-name
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_KEY=...
git push heroku main
```

**Access backend:**
```
https://your-app-name.herokuapp.com/api
```

### Option 4: Docker/Self-Hosted

**Create Dockerfile** in `backend/`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t feedback-api .
docker run -p 3000:3000 \
  -e SUPABASE_URL=... \
  -e SUPABASE_KEY=... \
  feedback-api
```

### Option 5: AWS Lambda/API Gateway

Suitable for serverless deployment. Requires additional setup with serverless framework.

## Troubleshooting

### "Port 3000 already in use"

Use a different port:
```bash
PORT=3001 npm start
```

Then update frontend API_BASE_URL to `http://localhost:3001/api`

### "Cannot find module 'express'"

Ensure dependencies are installed:
```bash
npm install
```

### "SUPABASE_URL is missing"

Check `.env` file exists and has correct values:
```bash
cat .env
```

Should show:
```
SUPABASE_URL=https://...
SUPABASE_KEY=eyJhbGc...
```

### "Feedback submission fails with 500 error"

**Check:**
1. Backend is running: `npm start`
2. Frontend API_BASE_URL matches backend URL
3. Supabase credentials are correct
4. `student_feedback` table exists in Supabase
5. RLS policies allow inserts (check `supabase/schema.sql`)

View logs in backend terminal for specific error.

### "CORS error in frontend"

Ensure CORS is enabled in `server.js` (it should be):
```javascript
app.use(cors());
```

If needed, restrict CORS:
```javascript
app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true
}));
```

### "Backend works but frontend shows network error"

**Check:**
1. Frontend is using correct API_BASE_URL
2. Backend server is actually running
3. Browser console shows exact error message
4. Try health check: `curl http://localhost:3000/api/health`

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://project.supabase.co` |
| `SUPABASE_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `PORT` | Server listening port | `3000` |
| `NODE_ENV` | Runtime environment | `development` or `production` |

## Next Steps

1. ✅ Backend is running locally
2. 🔄 Test with curl commands above
3. 🌐 Open `index.html` in browser and submit feedback
4. 📊 Check backend logs for confirmation
5. 🚀 Deploy to production when ready

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Deploying Node.js Apps](https://nodejs.org/en/docs/guides/nodejs-web-app/)

## Support

For issues:
1. Check the troubleshooting section above
2. View backend logs in terminal
3. Check browser console (F12) for frontend errors
4. Review [backend README.md](./backend/README.md) for API details
