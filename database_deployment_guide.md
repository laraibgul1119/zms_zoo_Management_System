# Database Deployment Guide (PostgreSQL)

This guide provides step-by-step instructions for deploying and initializing the PostgreSQL database for the Zoo Management System.

## 1. Choose a PostgreSQL Provider
We recommend using **Neon.tech** for a free and easy-to-use PostgreSQL database.
- Go to [Neon.tech](https://neon.tech) and create a free account.
- Create a new project (e.g., `zms-zoo`).
- Copy the **Connection String** (PostgreSQL URL). It should look something like:
  `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`

## 2. Configure Environment Variables
You need to provide the database connection string to the backend.

### Local Development
In your `backend` directory, create a `.env` file (if it doesn't exist) and add:
```env
DATABASE_URL=your_postgresql_connection_string_here
NODE_ENV=development
```

### Production (e.g., Render)
In your Render dashboard:
1. Go to your **Web Service** settings.
2. Select **Environment**.
3. Add a new secret named `DATABASE_URL` and paste your connection string.

## 3. Initialize the Database
The project includes a script to create all necessary tables.

### Run via NPM
From the `backend` directory, run:
```bash
npm run init-db
```
This will execute `src/db/init.ts` and create all tables (cages, animals, employees, etc.) if they don't already exist.

## 4. Troubleshooting
- **Connection Error**: Ensure your IP address is allowed (Whitelist) in the database provider's settings (Neon allows all IPs by default, but others might not).
- **SSL Issues**: In production, the app is configured to use SSL. Ensure your connection string includes `sslmode=require` or your provider supports SSL.
- **Environment Variables**: Double-check that `DATABASE_URL` is correctly spelled and has no trailing spaces.

## 5. Summary of Tables
The initialization script creates the following tables:
- `zoo_info`: Information about the zoo.
- `cages`: Enclosure details.
- `animals`: Resident animal data.
- `employees`: Staff records.
- `doctors`: Veterinary staff.
- `events`: Zoo events and schedules.
- `tickets`: Ticket types and prices.
- `ticket_sales`: Transaction records.
- `visitors`: Registered visitor accounts.
- `inventory`: Supplies and stock.
- `medical_checks`: Animal health records.
- `vaccinations`: Immunization history.
- `users`: Authentication accounts (Admin/Staff/Visitor).
