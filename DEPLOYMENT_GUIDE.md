# Zoo Management System - Deployment Guide

## ⚠️ Important: Render Free Tier Limitation

Render's free tier does NOT include persistent disk storage (it's paid).

## 🎯 Recommended Solutions:

### **Option 1: Railway (Best for SQLite - Free $5/month credit)**
### **Option 2: Render with Temporary Storage (Data resets on redeploy)**
### **Option 3: Render with PostgreSQL (Free, but requires code changes)**

---

## Option 1: Railway Deployment (RECOMMENDED)

Railway provides $5 free credit monthly and supports SQLite persistence.

### Step 1: Push Your Code

```bash
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

### Step 2: Deploy on Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your zoo management repository
6. Railway will auto-detect Node.js

### Step 3: Configure Service

1. Click on your service
2. Go to "Settings" tab
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### Step 4: Add Environment Variables

Go to "Variables" tab and add:
```
NODE_ENV=production
DATABASE_PATH=/app/backend/zoo.db
```

### Step 5: Generate Domain

1. Go to "Settings" tab
2. Scroll to "Networking"
3. Click "Generate Domain"
4. Copy your URL: `https://your-app.up.railway.app`

### Step 6: Test Backend

Visit: `https://your-app.up.railway.app/api/health`

Should return: `{"status":"ok"}`

---

## Option 2: Render with Temporary Storage

**Warning:** Database will reset on every redeploy. Good for testing only.

### Configuration

Your backend is already configured to use `/tmp` directory on Render.

### Environment Variables on Render:
```
NODE_ENV=production
PORT=10000
```

**No DATABASE_PATH needed** - it will auto-use /tmp directory.

### Deploy

1. Push code to GitHub
2. Render will auto-deploy
3. Database will be created in /tmp (temporary)

**Note:** Every time you redeploy or service restarts, all data is lost.

---

## Frontend Deployment (Vercel)

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Fix deployment configuration"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Environment Variables:**
   ```
   VITE_API_URL=https://zoo-management-backend.onrender.com/api
   ```

7. Click "Deploy"

### Step 3: Test Frontend

1. Visit your Vercel URL
2. Try to register/login
3. Check if data loads

---

## Troubleshooting

### Backend Issues

**503 Service Unavailable:**
- Backend is sleeping (free tier)
- Visit the health endpoint to wake it up
- Wait 30-60 seconds

**Database errors:**
- Check if disk is mounted
- Verify DATABASE_PATH environment variable
- Check logs for initialization errors

**Build failures:**
- Check if all dependencies are in package.json
- Verify TypeScript compiles locally: `npm run build`

### Frontend Issues

**API calls failing:**
- Check VITE_API_URL is set correctly
- Verify backend is running
- Check browser console for CORS errors

**Build failures:**
- Run `npm run build` locally to test
- Check for TypeScript errors
- Verify all dependencies are installed

### CORS Issues

If you see CORS errors, the backend already allows all origins.
Check browser console for the actual error.

---

## Important Notes

1. **Free Tier Limitations:**
   - Backend sleeps after 15 minutes of inactivity
   - First request takes 30-60 seconds to wake up
   - Database persists only with mounted disk

2. **Auto-Deploy:**
   - Both services auto-deploy on git push
   - Can disable in settings if needed

3. **Monitoring:**
   - Check Render logs for backend issues
   - Check Vercel logs for frontend issues
   - Use browser DevTools for client-side errors

---

## URLs

- Backend: https://zoo-management-backend.onrender.com
- Frontend: (Your Vercel URL)
- Health Check: https://zoo-management-backend.onrender.com/api/health
