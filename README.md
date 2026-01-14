# 🦁 ZMS - Zoo Management System

A comprehensive full-stack web application for managing zoo operations, including animal care, staff management, visitor services, ticketing, events, and inventory management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node. js-18.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Deployment](#deployment)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

## 🎯 Overview

ZMS is a modern zoo management system built with TypeScript, React, Node.js, and PostgreSQL. It provides two main interfaces:

1. **Public Interface**: For visitors to browse events, purchase tickets, and register
2. **Staff Interface**: For zoo staff to manage animals, employees, medical records, inventory, and operations

## 🏗️ Architecture

The system follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│    React + TypeScript + Vite + TailwindCSS                  │
│    - Public Pages (Visitor Interface)                       │
│    - Staff Pages (Admin Dashboard)                          │
│    - Shared Components & UI Library                         │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│         Node.js + Express + TypeScript                      │
│    - RESTful API Endpoints                                  │
│    - Business Logic & Services                              │
│    - Authentication & Authorization                         │
│    - Data Mapping (camelCase ↔ snake_case)                 │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                             │
│              PostgreSQL (Production)                        │
│    - Relational Schema with Foreign Keys                    │
│    - 12 Core Tables                                         │
│    - Persistent Data Storage                                │
└─────────────────────────────────────────────────────────────┘
```

### Key Technologies

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, React Router |
| **Backend** | Node.js, Express, TypeScript, node-postgres |
| **Database** | PostgreSQL (Production), SQLite (Development) |
| **Deployment** | Vercel (Frontend), Render (Backend), Neon (Database) |

---

## 🗄️ Database Design

The system uses **PostgreSQL** with a normalized relational schema consisting of 12 interconnected tables. 

### Database Schema

#### Core Tables

1. **`zoo_info`** - Zoo metadata (name, location, hours, capacity)
2. **`animals`** - Animal records (species, age, health, cage assignment)
3. **`cages`** - Enclosure management (capacity, occupancy, status)
4. **`employees`** - Staff records (role, salary, contact info)
5. **`doctors`** - Veterinarian profiles (specialization, availability)
6. **`medical_checks`** - Animal health examinations
7. **`vaccinations`** - Vaccination records and schedules
8. **`events`** - Zoo events (shows, talks, activities)
9. **`tickets`** - Ticket types and pricing
10. **`ticket_sales`** - Sales transactions
11. **`inventory`** - Supplies and resources
12. **`visitors`** - Visitor registrations
13. **`users`** - Authentication (staff login)

### Entity Relationships

```
animals ──< medical_checks >── doctors
   │
   └──< vaccinations
   │
   └──> cages (FK:  cage_id)

ticket_sales ──> tickets (FK: ticket_id)

events ──< registrations
```

### Key Features

- **Foreign Key Constraints**: Ensure referential integrity
- **Cascade Operations**: Automatic cleanup of dependent records
- **Indexed Columns**: Optimized queries on email, phone, date fields
- **Default Values**: Status fields default to 'Active' or 'Available'
- **Data Types**: TEXT for strings, INTEGER/REAL for numbers, TEXT for dates (ISO format)

### Database Initialization

Database tables are automatically created on backend startup:

```typescript
// backend/src/db/init.ts
export const initDb = async () => {
    const schema = `
        CREATE TABLE IF NOT EXISTS animals (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            species TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            health_status TEXT,
            cage_id TEXT,
            notes TEXT,
            FOREIGN KEY (cage_id) REFERENCES cages(id)
        );
        -- ... (additional tables)
    `;
    await pool.query(schema);
};
```

---

## 🎨 Frontend Structure

Built with **React 18** and **TypeScript** using a component-based architecture.

### Directory Structure

```
src/
├── pages/
│   ├── public/               # Visitor-facing pages
│   │   ├── RegisterPage.tsx
│   │   ├── EventsPage.tsx
│   │   └── TicketPurchasePage.tsx
│   ├── staff/                # Protected admin pages
│   │   ├── DashboardPage.tsx
│   │   ├── AnimalsPage.tsx
│   │   ├── EmployeesPage.tsx
│   │   ├── DoctorsPage.tsx
│   │   ├── MedicalChecksPage.tsx
│   │   ├── VaccinationsPage. tsx
│   │   ├── InventoryPage.tsx
│   │   ├── TicketSalesPage.tsx
│   │   └── EventManagementPage.tsx
│   └── LandingPage.tsx
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Select.tsx
│   │   └── Navbar.tsx
│   ├── ProtectedRoute.tsx    # Authentication guard
│   ├── AnimalShape.tsx
│   └── FeatureCard.tsx
├── contexts/
│   └── AuthContext.tsx       # Global auth state
├── utils/
│   ���── api.ts                # API client
├── types/
│   └── index.ts              # TypeScript interfaces
└── App.tsx                   # Main app & routing
```

### Routing

```typescript
// src/App.tsx
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/tickets" element={<TicketPurchasePage />} />
  <Route path="/events" element={<EventsPage />} />
  <Route path="/login" element={<LoginPage />} />

  {/* Protected Staff Routes */}
  <Route path="/dashboard" element={
    <ProtectedRoute><DashboardPage /></ProtectedRoute>
  } />
  <Route path="/animals" element={
    <ProtectedRoute><AnimalsPage /></ProtectedRoute>
  } />
  {/* ... additional protected routes */}
</Routes>
```

### State Management

- **Context API**: Used for global authentication state
- **React Hooks**:  Local state management (`useState`, `useEffect`)
- **React Router**: Navigation and route protection

### Styling

- **TailwindCSS**: Utility-first CSS framework
- **Neobrutalism Design**: Bold borders, shadows, and vibrant colors
- **Responsive Design**: Mobile-first approach

### API Integration

```typescript
// src/utils/api.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Animals
  getAnimals: () => fetch(`${API_BASE}/animals`).then(res => res.json()),
  createAnimal: (data) => fetch(`${API_BASE}/animals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  
  // Authentication
  login: (email, password) => fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON. stringify({ email, password })
  }),
  // ...  (additional API methods)
};
```

---

## ⚙️ Backend Structure

Built with **Node.js**, **Express**, and **TypeScript** following RESTful API principles.

### Directory Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── db.ts             # Database connection pool
│   │   ├── init.ts           # Schema initialization
│   │   └── seed.ts           # Sample data seeding
│   ├── utils/
│   │   └── mapper.ts         # camelCase ↔ snake_case conversion
│   └── index.ts              # Main server file
└── package.json
```

### Server Initialization

```typescript
// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import { pool } from './db/db';
import { initDb } from './db/init';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
(async () => {
    await initDb();
    console.log('✓ Database initialized successfully');
})();

// Routes
app.get('/api/health', async (req, res) => {
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', database: 'connected', time: dbCheck.rows[0]. now });
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
```

### Database Connection

```typescript
// backend/src/db/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process. env.NODE_ENV === 'production' ? { rejectUnauthorized:  false } : false
});
```

### Data Mapping

Frontend uses **camelCase** while database uses **snake_case**: 

```typescript
// backend/src/utils/mapper.ts
export const keysToCamel = (obj:  any): any => {
    // Converts:  first_name → firstName
};

export const keysToSnake = (obj:  any): any => {
    // Converts: firstName → first_name
};
```

Usage: 
```typescript
app.get('/api/animals', async (req, res) => {
    const result = await pool.query('SELECT * FROM animals');
    res.json(keysToCamel(result.rows)); // Return camelCase to frontend
});

app.post('/api/animals', async (req, res) => {
    const data = keysToSnake(req.body); // Convert to snake_case for DB
    await pool.query('INSERT INTO animals (...) VALUES (...)', Object.values(data));
});
```

---

## 📁 Project Structure

```
zms_zoo_Management_System/
├── src/                      # Frontend source
│   ├── pages/
│   ├── components/
│   ├── contexts/
│   ├── utils/
│   └── types/
├── backend/                  # Backend source
│   └── src/
│       ├── db/
│       ├── utils/
│       └── index.ts
├── public/                   # Static assets
├── DEPLOYMENT_GUIDE.md       # Deployment instructions
├── SIMPLE_FREE_DEPLOYMENT.md # Free tier deployment
├── create_docs.py            # Documentation generator
├── package.json              # Frontend dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # TailwindCSS config
├── vite.config.ts            # Vite config
└── README.md                 # This file
```

---

## 🚀 Installation

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 15.x (or Neon account for cloud database)
- npm or yarn package manager

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/laraibgul1119/zms_zoo_Management_System.git
cd zms_zoo_Management_System
```

2. **Install dependencies**

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd .. 
```

3. **Set up environment variables**

Create `.env` in the root directory: 
```env
VITE_API_URL=http://localhost:3001/api
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/zoo_db
PORT=3001
NODE_ENV=development
```

4. **Initialize database**

```bash
cd backend
npm run db:init
npm run db:seed  # (Optional) Load sample data
```

5. **Start development servers**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

6. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

---

## 🌐 Deployment

### Production Deployment (100% Free)

The system is configured for deployment using free tier services:

#### Architecture

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Vercel     │ ----> │    Render    │ ----> │     Neon     │
│  (Frontend)  │       │  (Backend)   │       │  (Database)  │
└──────────────┘       └──────────────┘       └──────────────┘
```

### Step-by-Step Deployment

#### 1. Database (Neon - PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech) (free forever)
2. Create a new project:  `zootopia`
3. Copy the **Connection String** (looks like: `postgresql://user:pass@host/db? sslmode=require`)
4. Save this for backend configuration

#### 2. Backend (Render)

1. Sign up at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure: 
   - **Name**: `zoo-management-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   DATABASE_URL=<your-neon-connection-string>
   NODE_ENV=production
   PORT=3001
   ```
6. Click "Create Web Service"
7. Wait for deployment and copy the backend URL (e.g., `https://zoo-management-backend.onrender. com`)

#### 3. Frontend (Vercel)

1. Sign up at [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**:  Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://zoo-management-backend.onrender.com/api
   ```
6. Click "Deploy"
7. Access your live application at the provided Vercel URL

### Deployment Notes

- ✅ **Persistent Database**: Data persists across deployments
- ⚠️ **Backend Cold Starts**: Free tier sleeps after 15 minutes of inactivity (30-60s wake time)
- 🔄 **Auto-Deploy**: Both services automatically redeploy on `git push`
- 📊 **Monitoring**: Check logs in Render/Vercel dashboards

### Alternative: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

```bash
docker build -t zms-backend ./backend
docker run -p 3001:3001 --env-file .env zms-backend
```

---

## ✨ Features

### Public Features
- 🎟️ **Ticket Purchase**: Buy tickets online with discount codes
- 📅 **Event Registration**: Register for zoo events and shows
- 🦁 **Browse Animals**: View animal information and exhibits
- 📍 **Zoo Information**: Hours, location, and capacity

### Staff Features
- 🐾 **Animal Management**: Track animals, health, and cage assignments
- 👨‍⚕️ **Medical Records**: Schedule checkups, vaccinations, treatments
- 👥 **Employee Management**: Staff records, salaries, roles
- 📦 **Inventory**: Track supplies, expiration dates, reorder alerts
- 💰 **Sales Tracking**: Monitor ticket sales and revenue
- 📊 **Dashboard**: Real-time statistics and alerts

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |

### Animals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/animals` | Get all animals |
| POST | `/api/animals` | Create animal |
| PUT | `/api/animals/:id` | Update animal |
| DELETE | `/api/animals/:id` | Delete animal |

### Cages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cages` | Get all cages |
| POST | `/api/cages` | Create cage |
| PUT | `/api/cages/:id` | Update cage |
| DELETE | `/api/cages/:id` | Delete cage |

### Medical
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medical-checks` | Get all medical checks |
| POST | `/api/medical-checks` | Create medical check |
| GET | `/api/vaccinations` | Get all vaccinations |
| POST | `/api/vaccinations` | Create vaccination |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | Get all doctors |
| POST | `/api/doctors` | Create doctor |
| PUT | `/api/doctors/:id` | Update doctor |
| DELETE | `/api/doctors/:id` | Delete doctor |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

### Tickets & Sales
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | Get all tickets |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/ticket-sales` | Get all sales |
| POST | `/api/ticket-sales` | Record sale |

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Get all inventory |
| POST | `/api/inventory` | Add item |
| PUT | `/api/inventory/:id` | Update item |
| DELETE | `/api/inventory/:id` | Delete item |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |

---

## 🔐 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001/api  # Backend API URL
```

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:pass@host: 5432/zoo_db  # PostgreSQL connection
PORT=3001                                               # Server port
NODE_ENV=development                                    # Environment (development/production)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Laraib Gul**
- GitHub: [@laraibgul1119](https://github.com/laraibgul1119)

---

## 🙏 Acknowledgments

- React & Vite communities
- PostgreSQL & Neon for database hosting
- Vercel & Render for free hosting
- TailwindCSS for styling

---

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the maintainer. 

---

<div align="center">
Made with ❤️ for zoo management
</div>
