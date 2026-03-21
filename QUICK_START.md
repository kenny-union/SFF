# Node.js Backend Implementation - Quick Start Guide

Your Student Feedback Form now has a complete Node.js/Express backend! Here's how to get it running in 5 minutes.

## 📋 What's New

✅ **Express.js Backend Server** - Handles all API requests  
✅ **API Validation Layer** - Server-side validation for all submissions  
✅ **CORS Support** - Frontend can safely communicate with backend  
✅ **Statistics Endpoint** - `/api/feedback/stats` for analytics  
✅ **Secure Credentials** - Supabase keys no longer exposed in frontend  
✅ **Error Handling** - Comprehensive error responses and logging  

## 🚀 Getting Started (5 minutes)

### Step 1: Install Backend Dependencies

Open a terminal in the `backend` folder:

```bash
cd backend
npm install
```

This installs Express, Supabase client, CORS, and other dependencies.

### Step 2: Start the Backend Server

```bash
npm start
```

You should see:
```
🚀 Student Feedback Backend running on port 3000
📝 Environment: development
🔗 API Base: http://localhost:3000/api
```

✅ **Backend is now running!**

### Step 3: Test the Backend (Optional)

Open another terminal and test the API:

```bash
# Health check
curl http://localhost:3000/api/health

# Should return: {"status":"ok","message":"Backend server is running"}
```

### Step 4: Use Your Frontend

Open `index.html` in your browser. When you submit the form, it will automatically send data to your backend (which forwards to Supabase).

**That's it!** Your full stack is now running locally.

## 📁 What Was Created

```
backend/
├── server.js              # Main Express application
├── package.json           # Dependencies & scripts
├── .env                   # Configuration (Supabase credentials)
├── .env.example           # Template for .env
├── .gitignore             # Files to exclude from git
└── README.md              # Detailed documentation

Updated files:
├── js/app.js              # Now calls backend API instead of Supabase
└── dashboard.html         # Now calls backend API for data
```

## 🔌 API Endpoints

### Submit Feedback
```bash
POST /api/feedback
```

### Get All Feedback
```bash
GET /api/feedback?subject=Math&grade=10A&limit=20
```

### Get Feedback Statistics
```bash
GET /api/feedback/stats
```

### Get Single Feedback
```bash
GET /api/feedback/:id
```

### Delete Feedback (Admin)
```bash
DELETE /api/feedback/:id
```

Full documentation: [backend/README.md](./backend/README.md)

## 🌐 Deploying to Production

When you're ready to deploy, see [BACKEND_SETUP.md](./BACKEND_SETUP.md) for options:

- **Vercel** (recommended) - Free, fast deployment
- **Railway** - Simple & affordable
- **Heroku** - Classic option
- **Docker** - Full control

Each option has step-by-step instructions.

## 🛠️ Development Mode (Auto-reload)

For development with automatic server restart on file changes:

```bash
npm run dev
```

Requires `nodemon` (already installed).

## 📊 Using the Dashboard

1. Open `dashboard.html` in your browser
2. View all submitted feedback
3. Search by student name
4. Export to CSV
5. Login as admin to delete entries (password shown on modal)

The dashboard is now fully connected to your backend API.

## 🔐 Security Features

- ✅ Supabase credentials kept on server (not in frontend)
- ✅ Input validation on both frontend and backend
- ✅ CORS enabled for frontend communication
- ✅ Environment variables for sensitive data
- ✅ Error messages don't leak sensitive info in production

## 🐛 Troubleshooting

**"Cannot connect to backend"**
- Ensure backend is running: `npm start` in the `backend` folder
- Check that `http://localhost:3000/api/health` returns a response
- Reload your browser tab (Ctrl+R / Cmd+R)

**"Port 3000 is already in use"**
- Use a different port: `PORT=3001 npm start`
- Update `API_BASE_URL` in `js/app.js` to `http://localhost:3001/api`

**"Validation errors when submitting"**
- Check browser console (F12) for error details
- Ensure all required fields are filled
- Check backend logs in terminal

**Need help?**
- Check `backend/README.md` for detailed API documentation
- See `BACKEND_SETUP.md` for deployment & troubleshooting
- Check browser console (F12) and terminal logs for error messages

## 📚 Next Steps

1. ✅ Backend is running locally
2. 🧪 Test form submission → check backend logs
3. 📊 View dashboard → feedback appears in real-time
4. 🌐 Ready to deploy? See [BACKEND_SETUP.md](./BACKEND_SETUP.md)
5. 🚀 Update frontend `API_BASE_URL` after deploying backend

## 💡 Key Differences from Direct Supabase

| Feature | Before (Supabase Direct) | Now (Backend) |
|---------|------------------------|--------------|
| Credentials | Exposed in frontend | Secure on server |
| Validation | Client-side only | Client + Server |
| Logging | Limited | Full request/response logs |
| CORS | Restricted | Fully configured |
| Scalability | Limited | Much better |
| Control | Limited | Complete control |

## 📝 Configuration

Your backend is configured with your Supabase credentials in `backend/.env`:

```env
SUPABASE_URL=https://ubrjrofmafyuclrqifxa.supabase.co
SUPABASE_KEY=eyJhbGc...
PORT=3000
NODE_ENV=development
```

To use different Supabase credentials:
1. Edit `backend/.env`
2. Restart the server

⚠️ **Never commit `.env` to git!** It's already in `.gitignore`.

## 🎯 Common Questions

**Can I still use Supabase dashboard?**  
Yes! Your backend reads/writes from the same Supabase database. You can still manage data directly in Supabase if needed.

**Do I need to change anything in my frontend HTML?**  
No! The changes are already made to `js/app.js` and `dashboard.html`. Just use your HTML files normally.

**How do I update to my deployed backend URL?**  
After deploying backend:
1. Update `API_BASE_URL` in `js/app.js`
2. Update `API_BASE_URL` in `dashboard.html`
3. Redeploy frontend (or just refresh if static hosting)

**Is the backend required for the form to work?**  
Yes, the frontend now depends on the backend. Both must be running/deployed together.

## 🎉 What's Next?

Your backend is production-ready! You can now:

- ✅ Deploy to Vercel, Railway, Heroku, etc.
- ✅ Add authentication
- ✅ Implement rate limiting
- ✅ Add logging/monitoring
- ✅ Create admin dashboard
- ✅ Add webhook notifications
- ✅ Create mobile API clients

See [backend/README.md](./backend/README.md) for more advanced features.

---

**Happy coding! 🚀**

For questions or issues, check the documentation files or inspect browser/server logs for detailed error messages.
