# EcoIssue Campus Hub

A Sustainable Campus Decision Support System (DSS) that enables students and staff to report environmental issues within the campus and supports administrators in managing and resolving these issues through recommendation-based decision support.

## Features

- **Secure Authentication** – User and admin login with JWT
- **Issue Reporting** – Report water leakage, energy misuse, waste overflow, and other sustainability issues
- **Admin Dashboard** – Monitor all issues, update status (Pending → In Progress → Solved)
- **Decision Support** – Eco-friendly recommendations for each issue type
- **Sustainability Analytics** – Summary by type, status, and top problem areas

## Tech Stack

- **Frontend:** React, Bootstrap 5, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Install Dependencies

```bash
npm run install:all
```

Or manually:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Backend

Copy `backend/.env.example` to `backend/.env` and set:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecoissue_campus
JWT_SECRET=your_secret_key
```

### 3. Seed Admin User (optional)

```bash
cd backend
node scripts/seedAdmin.js
```

Default admin: `admin@campus.edu` / `Admin@123`

### 4. Run the Application

**Option A – Run both (requires `concurrently`):**
```bash
npm run dev
```

**Option B – Run separately:**

Terminal 1 (backend):
```bash
npm run server
```

Terminal 2 (frontend):
```bash
npm run client
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Usage

1. **Register** as a student/staff user
2. **Report issues** with location, type, and description
3. **Track status** on the My Issues page
4. **Admin:** Login with admin credentials, view dashboard, update issue status, and review analytics
