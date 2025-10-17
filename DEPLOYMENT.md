# Deployment Guide

This guide will help you deploy your Financial Analytics Dashboard with:
- **Frontend (Next.js)** on Vercel
- **Backend (FastAPI)** on Railway

## Prerequisites

- GitHub account
- Vercel account (free tier)
- Railway account (free tier - $5/month credit)

---

## Step 1: Deploy Backend on Railway

### 1.1 Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your repository
5. Select your `financial-analytics-dashboard` repository

### 1.2 Configure Backend Service

1. Railway will detect your backend automatically
2. Click **"Settings"** → **"General"**
3. Set **Root Directory**: `backend`
4. Click **"Deploy"**

### 1.3 Add Redis Service

1. Click **"+ New"** → **"Database"** → **"Add Redis"**
2. Railway will automatically create a Redis instance
3. Railway will auto-inject `REDIS_URL` environment variable (no config needed!)

### 1.4 Add Environment Variables

Go to **"Variables"** tab and add:

```
ALPHAVANTAGE_API_KEY=OZCSK6IVMQCQENWQ
FINANCIAL_MODELLING_API_KEY=edCq1doPehWWai0b4ceE8hQaxtGYh7fZ
NEXT_PUBLIC_SUPABASE_URL=https://bniglwjpekvrhdqfoyko.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaWdsd2pwZWt2cmhkcWZveWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2OTE4MzEsImV4cCI6MjA2ODI2NzgzMX0.WuFlMOsEh9LZtXrWwxXbIKY5KGGWkksusqxoEZJqzf4
HF_TOKEN=your_huggingface_token_if_needed
```

### 1.5 Get Your Backend URL

1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://your-app.up.railway.app`)
4. **Save this URL** - you'll need it for Vercel

---

## Step 2: Deploy Frontend on Vercel

### 2.1 Create Vercel Project

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will detect Next.js automatically

### 2.2 Configure Build Settings

**Framework Preset:** Next.js (auto-detected)
**Root Directory:** `frontend-next`
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `.next` (auto-detected)

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add:

```
FASTAPI_URL=https://your-app.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://bniglwjpekvrhdqfoyko.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaWdsd2pwZWt2cmhkcWZveWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2OTE4MzEsImV4cCI6MjA2ODI2NzgzMX0.WuFlMOsEh9LZtXrWwxXbIKY5KGGWkksusqxoEZJqzf4
```

**Important:** Replace `https://your-app.up.railway.app` with your actual Railway backend URL from Step 1.5

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. You'll get a live URL (e.g., `https://your-app.vercel.app`)

---

## Step 3: Configure Supabase (Important!)

Your Supabase project needs to know your production URL for auth redirects to work properly.

### 3.1 Update Site URL

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Update the following:
   - **Site URL**: `https://your-app.vercel.app` (replace with your actual Vercel URL)
   - **Redirect URLs**: Add these URLs:
     ```
     https://your-app.vercel.app/auth/callback
     https://your-app.vercel.app/auth/reset-password
     http://localhost:3000/auth/callback
     http://localhost:3000/auth/reset-password
     ```

### 3.2 Email Templates (Optional but Recommended)

1. Go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. The default template should work, but verify it uses `{{ .SiteURL }}` for the redirect

**Why this is important:** Without this configuration, password reset emails will link to `localhost` instead of your production URL.

---

## Step 4: Update Backend CORS (Important!)

Your backend needs to allow requests from your Vercel frontend.

### Option A: Allow Vercel Domain Only (Recommended)

Edit `backend/main.py` line 162-167:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",  # Replace with your Vercel URL
        "http://localhost:3000"  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Option B: Keep Wildcard (Less Secure)

Keep current `allow_origins=["*"]` for testing, but change it later for production.

After updating, push changes to GitHub - Railway will auto-redeploy.

---

## Step 5: Update Frontend API Calls

Make sure `frontend-next/src/utils/endpoints.ts` uses the environment variable:

```typescript
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';
```

---

## Step 6: Test Your Deployment

### Test Backend
Visit: `https://your-app.up.railway.app`
You should see: `{"message": "Trading API is running"}`

### Test Redis Health
Visit: `https://your-app.up.railway.app/health/redis`
You should see: `{"status": "healthy", "redis": "connected"}`

### Test Frontend
Visit: `https://your-app.vercel.app`
Your app should load and fetch data from the backend

---

## Troubleshooting

### Backend won't start
- Check Railway logs: **Deployments** → Click latest deployment → **View Logs**
- Common issues:
  - Missing environment variables
  - Python version mismatch (should be 3.11)
  - Redis not connected

### Frontend can't reach backend
- Check browser console for CORS errors
- Verify `FASTAPI_URL` is set correctly in Vercel
- Update CORS settings in `backend/main.py`

### Redis connection failed
- Railway Redis should auto-connect
- Check if Redis service is running in Railway dashboard
- Verify `REDIS_URL` is auto-injected (Railway does this automatically)

---

## Environment Variables Summary

### Railway (Backend)
| Variable | Value |
|----------|-------|
| `REDIS_URL` | Auto-provided by Railway ✅ |
| `ALPHAVANTAGE_API_KEY` | Your API key |
| `FINANCIAL_MODELLING_API_KEY` | Your API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase key |
| `HF_TOKEN` | Optional HuggingFace token |

### Vercel (Frontend)
| Variable | Value |
|----------|-------|
| `FASTAPI_URL` | Your Railway backend URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase key |

---

## Cost Breakdown

- **Vercel**: FREE (hobby tier)
- **Railway**: FREE ($5/month credit, typically enough for hobby projects)
- **Supabase**: FREE (already using)

**Total: $0/month** for hobby usage

---

## Monitoring & Logs

### Railway Logs
Railway Dashboard → Project → Service → **View Logs**

### Vercel Logs
Vercel Dashboard → Project → **Deployments** → Click deployment → **Function Logs**

### Redis Stats
Visit: `https://your-app.up.railway.app/admin/redis/stats`

---

## Continuous Deployment

Both platforms support auto-deployment:

✅ **Push to GitHub** → Railway auto-deploys backend
✅ **Push to GitHub** → Vercel auto-deploys frontend

No manual steps needed after initial setup!

---

## Next Steps

1. **Custom Domain** (optional): Add custom domain in Vercel settings
2. **Monitoring**: Set up error tracking (Sentry, LogRocket)
3. **Analytics**: Add Vercel Analytics or Google Analytics
4. **Security**:
   - Rotate API keys regularly
   - Use environment-specific secrets
   - Update CORS settings for production

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Your Backend Health**: `https://your-app.up.railway.app/health/redis`
