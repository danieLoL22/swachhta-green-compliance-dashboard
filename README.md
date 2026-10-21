# Swachhta & Green Standard Compliance Monitoring Dashboard (MERN)

Digital monitoring platform for college campus cleanliness & environmental standards.

## Tech Stack
MongoDB, Mongoose, Express, Node.js, React (Vite), Axios, JWT, bcryptjs, Recharts, Tailwind CSS, Lucide React, Multer (local uploads).

## Folder Structure
```
swachhta-green-compliance-dashboard/
  server/ (config, controllers, middleware, models, routes, utils, uploads, server.js)
  client/ (src/components, pages, layouts, services, context, charts, utils)
```

## Requirements
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

## MongoDB Atlas Setup
1. Create free cluster at cloud.mongodb.com
2. Create user + password, allow network access 0.0.0.0/0
3. Copy connection string: `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/swachhta_green`

## Backend Setup
```bash
cd server
npm install
cp .env.example .env   # then edit MONGO_URI, JWT_SECRET, PORT
npm run seed            # seeds admin, inspector, categories, standards, locations, inspections, issues
npm run dev             # http://localhost:5000
```

`.env`:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=long_random_secret_change_me
PORT=5000
CLIENT_URL=http://localhost:5173
```

## Frontend Setup
```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev             # http://localhost:5173
```

## Default Logins (CHANGE AFTER FIRST LOGIN!)
- Admin: admin@swachhta.com / Admin@123
- Inspector: inspector@swachhta.com / Inspector@123

> ⚠️ Change default passwords immediately via Profile or DB.

## How Auth Works
- Login POST /api/auth/login validates bcrypt hash, returns JWT (7d).
- Frontend stores token in localStorage, axios interceptor sends `Authorization: Bearer`.
- `protect` middleware verifies JWT; `authorize('admin')` restricts admin routes.

## How Inspections Work
Inspector → New Inspection → select Location + Category → standards load → mark Compliant (100) / Partial (50) / Non-Compliant (0) + remarks + evidence upload → submit. Backend calculates score, stores inspection, auto-creates Issue for each Non-Compliant finding.

## Scoring
score = obtained / possible × 100. 80–100 Good, 60–79 Needs Improvement, <60 Poor. Dashboard aggregates overall, per-category, per-location, monthly trend from real DB data.

## Recurring Violations
Same standard + location marked Non-Compliant ≥2 times appears as "Recurring Violation" on dashboard.

## Deploy
- Backend: Render/Railway (set env vars, `npm start`).
- Frontend: Vercel/Netlify (set VITE_API_URL to backend URL, `npm run build`).
