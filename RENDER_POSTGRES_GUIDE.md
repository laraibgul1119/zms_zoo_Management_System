# Deploy with PostgreSQL on Render (Free Tier)

Render's free tier includes PostgreSQL database, which is better than SQLite for production.

## Quick Migration Steps:

### 1. Install PostgreSQL Package

In backend directory:
```bash
cd backend
npm install pg
npm install --save-dev @types/pg
```

### 2. Create PostgreSQL Database on Render

1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Name: `zoo-database`
4. Select Free tier
5. Click "Create Database"
6. Copy the "Internal Database URL"

### 3. Update Backend to Use PostgreSQL

You'll need to:
- Replace better-sqlite3 with pg
- Update all SQL queries (minor syntax changes)
- Use the DATABASE_URL from Render

### 4. Deploy Backend

Environment variables:
```
NODE_ENV=production
DATABASE_URL=(paste from Render PostgreSQL)
```

## Note:
This requires code changes. If you want to stick with SQLite, use Railway instead.
