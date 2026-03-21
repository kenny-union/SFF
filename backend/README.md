# Student Feedback Backend API

Node.js/Express backend server for the Student Feedback Form. This server acts as an API gateway to Supabase, providing validation, error handling, CORS support, and centralized business logic.

## Features

- ✅ **Validation**: Server-side validation of all feedback submissions
- 🔐 **Security**: Keeps Supabase credentials safe (not exposed to frontend)
- 🔄 **CORS Support**: Handles cross-origin requests from frontend
- 📊 **Statistics API**: Endpoint for computing feedback statistics
- 🗃️ **Filtering**: Query feedback by subject, grade, with pagination
- 🚀 **Production Ready**: Error handling, logging, and best practices

## Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Supabase account with student_feedback table set up

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update with your Supabase credentials:
     ```
     SUPABASE_URL=your-supabase-url
     SUPABASE_KEY=your-supabase-anonymous-key
     PORT=3000
     NODE_ENV=development
     ```

3. **Start the server**:
   ```bash
   npm start        # Production
   npm run dev      # Development (with hot reload)
   ```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Submit Feedback
```
POST /api/feedback
Content-Type: application/json

{
  "full_name": "John Doe",
  "student_id": "12345",
  "email": "john@example.com",
  "grade": "10A",
  "subject": "Math",
  "overall_rating": 5,
  "teaching_rating": 4,
  "materials_rating": 5,
  "mood": "happy",
  "enjoyed": ["teacher", "content"],
  "liked_most": "Great explanations",
  "improvements": "More practice problems",
  "additional_comments": ""
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "id": "uuid-of-feedback"
}
```

### Get All Feedback
```
GET /api/feedback?subject=Math&grade=10A&limit=20&offset=0
```

**Query Parameters**:
- `subject` (optional): Filter by subject
- `grade` (optional): Filter by grade
- `limit` (optional, default: 100): Number of results
- `offset` (optional, default: 0): Pagination offset

**Response**:
```json
{
  "success": true,
  "data": [...],
  "count": 25,
  "limit": 20,
  "offset": 0
}
```

### Get Feedback Statistics
```
GET /api/feedback/stats
```

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalResponses": 100,
    "averageRating": "4.2",
    "ratingDistribution": {
      "1": 5,
      "2": 10,
      "3": 20,
      "4": 35,
      "5": 30
    },
    "bySubject": {
      "Math": 45,
      "Science": 55
    },
    "byGrade": {
      "10A": 50,
      "10B": 50
    }
  }
}
```

### Get Single Feedback
```
GET /api/feedback/:id
```

**Response**:
```json
{
  "success": true,
  "data": { ...feedback object... }
}
```

## Frontend Integration

Update `/js/app.js` to point to your backend:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
// For production: 'https://your-backend.com/api'
```

The frontend will automatically send form submissions to the backend instead of directly to Supabase.

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deploy (Vercel, Railway, Render, Heroku, etc.)

1. Set environment variables on hosting platform
2. Run `npm install` and `npm start`
3. Update frontend `API_BASE_URL` to your deployed URL

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t feedback-api .
docker run -p 3000:3000 -e SUPABASE_URL=... -e SUPABASE_KEY=... feedback-api
```

## Error Handling

All endpoints return error responses in this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["field1 error", "field2 error"],
  "error": "detailed-error-message"
}
```

Status codes:
- `200/201`: Success
- `400`: Validation failed
- `404`: Resource not found
- `500`: Server error

## Validation Rules

Submission validation enforces:
- ✓ `full_name`: Required, non-empty
- ✓ `grade`: Required
- ✓ `subject`: Required
- ✓ `overall_rating`: Required, 1-5
- ✓ `liked_most`: Required, non-empty
- ✓ `teaching_rating`: Optional, 1-5 if provided
- ✓ `materials_rating`: Optional, 1-5 if provided

## Logging

The server logs all requests and operations:
- API requests with method and path
- Success/error messages
- Database operations

View logs in console when running locally.

## Troubleshooting

**"Cannot connect to backend"**:
- Ensure backend server is running: `npm start`
- Check API_BASE_URL in frontend matches backend port
- Check CORS is enabled (it is by default)

**"Supabase credentials invalid"**:
- Verify SUPABASE_URL and SUPABASE_KEY in `.env`
- Check credentials haven't expired
- Ensure table `student_feedback` exists

**"Validation errors"**:
- Check all required fields are provided
- Verify rating values are 1-5
- Check field content isn't exceeding limits

## Security Notes

- ⚠️ Do NOT expose `SUPABASE_KEY` in frontend code (backend handles it)
- ⚠️ Keep `.env` file out of version control
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for production (see middleware options)
- ⚠️ Add authentication if restricting data access

## Future Enhancements

- [ ] Rate limiting middleware
- [ ] Request logging/monitoring
- [ ] Authentication & authorization
- [ ] Data export (CSV/PDF)
- [ ] Advanced filtering & search
- [ ] Caching for statistics
- [ ] Batch operations
- [ ] Webhook notifications

## License

MIT
