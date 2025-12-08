# JobFinder MERN (Converted)

This repository is a MERN-stack conversion of your original Job Finder Vite + React project.
Frontend UI was preserved from the original project and placed under `/frontend`.
Backend (Express + MongoDB) is under `/backend`.

## Running locally (developer machine)

Prerequisites:
- Node.js 18+
- npm
- MongoDB (local or Atlas)

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- Opens at http://localhost:5173 (the Vite dev server proxies `/api` to backend)

### Backend
```bash
cd backend
npm install
# create a .env file from .env.example and set MONGO_URI if needed
cp .env.example .env
npm run dev   # requires nodemon, or use `npm start` to run once
```

API endpoints:
- `GET /api/jobs` — list jobs
- `POST /api/jobs` — create job
- `GET /api/jobs/:id` — get single job
- `PUT /api/jobs/:id` — update job
- `DELETE /api/jobs/:id` — delete job