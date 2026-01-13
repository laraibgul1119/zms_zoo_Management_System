# 100% Free Deployment Guide (No Credit Card)

## Current Setup: Vercel + Render (Free Tiers)

### ✅ What's Free Forever:
- Vercel: Frontend hosting (unlimited)
- Render: Backend hosting (750 hours/month)
- Database: Temporary (resets on redeploy)

### ⚠️ Limitation:
Database data will be lost when:
- You redeploy the backend
- Render restarts your service (after 15 min inactivity)

### 💡 This is PERFECT for:
- Portfolio projects
- Demos for job interviews
- Testing and development
- Learning and practice

---

## Simple & Free Deployment Guide (Persistent Database)

This project is now configured for a robust free deployment using **PostgreSQL** (for persistent data) instead of SQLite.

## Phase 1: Database (Neon)
1.  Go to [Neon.tech](https://neon.tech) and create a free account.
2.  Create a new project named `zootopia`.
3.  Copy the **Connection String** (PostgreSQL URL).

## Phase 2: Backend (Render)
1.  Connect your GitHub repository to [Render](https://render.com).
2.  Create a new **Web Service**.
3.  Select the `backend` directory as the root.
4.  Add these **Environment Variables**:
    - `DATABASE_URL`: (Paste your Neon Connection String)
    - `NODE_ENV`: `production`
5.  Render will automatically build and deploy your backend.

## Phase 3: Frontend (Vercel)
1.  Connect your GitHub repository to [Vercel](https://vercel.com).
2.  Set the Framework Preset to **Vite**.
3.  Add this **Environment Variable**:
    - `VITE_API_URL`: (Your Render Backend URL + `/api`)
4.  Deploy!

## Why This is Better
- **Persistence**: SQLite data on Render's free tier is lost whenever the server restarts. PostgreSQL (Neon) stores your data permanently.
- **Reliability**: Separating frontend (Vercel) and backend (Render) ensures better performance and avoids timeout issues.
- **No Cost**: All these services offer generous free tiers.

## Testing Your Deployed App

1. Visit your Vercel URL
2. Wait 30-60 seconds (backend might be sleeping)
3. Try to register a new account
4. Login and explore the app
5. All features should work!

---

## Important Notes

### Backend Sleep (Free Tier):
- Render free tier sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- This is normal and expected

### Database Resets:
- Data is stored in `/tmp` directory
- Resets when service restarts
- For demo purposes, this is fine
- Add sample data after each restart if needed

### Auto-Deploy:
- Every git push triggers automatic deployment
- Both Vercel and Render will redeploy
- Takes 2-3 minutes

---

## Making It Production-Ready (Optional)

If you want persistent data, you have these options:

### Option A: Railway ($5/month free credit)
- Persistent SQLite database
- No code changes needed
- Free tier: $5 credit monthly

### Option B: Render PostgreSQL (Free)
- Free PostgreSQL database
- Requires code migration (SQLite → PostgreSQL)
- Data persists forever

### Option C: Supabase (Free)
- Free PostgreSQL database
- 500MB storage
- Requires code migration

---

## Cost Summary

**Current Setup:**
- Frontend (Vercel): $0/month ✓
- Backend (Render): $0/month ✓
- Total: **$0/month** ✓

**With Persistent Database:**
- Railway: $0-5/month (free credit)
- Render + PostgreSQL: $0/month
- Supabase: $0/month

---

## Next Steps

1. ✅ Push your code to GitHub
2. ✅ Deploy frontend on Vercel (5 minutes)
3. ✅ Test your live app
4. ✅ Share the URL!

Your app will be 100% functional and free to use!
