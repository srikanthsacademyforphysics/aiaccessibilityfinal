# AI Accessibility Backend API

This is the backend API for the AI Accessibility mobile app, deployed on Vercel as serverless functions.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository** (if you have this in GitHub) OR
4. **Upload** this `backend` folder directly
5. Click **"Deploy"**
6. Copy the deployment URL (e.g., `https://your-project-name.vercel.app`)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to backend folder
cd backend

# Deploy
vercel

# Follow the prompts
# When asked "Set up and deploy?", choose Yes
# When asked "Which scope?", choose your account
# When asked "Link to existing project?", choose No
# When asked "Project name?", enter: ai-accessibility-backend
# When asked "Directory?", press Enter (current directory)
```

## 📝 API Endpoints

### 1. `/api/analyze`
Analyzes images and answers questions.

**Request:**
```json
POST /api/analyze
{
  "image": "base64-encoded-image-string",
  "question": "What is this object?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "This is a description..."
}
```

### 2. `/api/find-object`
Searches for specific objects in images.

**Request:**
```json
POST /api/find-object
{
  "image": "base64-encoded-image-string",
  "objectName": "phone"
}
```

**Response:**
```json
{
  "success": true,
  "found": false,
  "guidance": "I don't see a phone. Try moving left..."
}
```

## 🔧 Setup AI Integration

Currently, the endpoints return mock responses. To add real AI:

### Using OpenAI Vision API:

1. **Get API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key

2. **Add to Vercel Environment Variables:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add: `OPENAI_API_KEY` = `your-api-key-here`

3. **Update the code:**
   - Uncomment the OpenAI code in `api/analyze.js` and `api/find-object.js`
   - Remove the mock response code

### Using Google Vision API:

Similar process, but use Google Cloud Vision API instead.

## 📱 Update Mobile App

After deploying, update these files in your mobile app:

1. `screens/CameraScreen.js` - Line 16
2. `screens/ObjectFinderScreen.js` - Line 18

Change:
```javascript
const BACKEND_URL = 'https://your-vercel-url.vercel.app';
```

To your actual Vercel URL:
```javascript
const BACKEND_URL = 'https://ai-accessibility-backend.vercel.app';
```

## 🧪 Test the API

You can test the endpoints using curl or Postman:

```bash
curl -X POST https://your-backend.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image": "base64string", "question": "What is this?"}'
```

## 📚 Resources

- [Vercel Serverless Functions Docs](https://vercel.com/docs/functions)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
