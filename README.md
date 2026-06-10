# Task Manager — Backend API

REST API for a full-stack task management application. Built with **Node.js**, **Express**, **MongoDB**, and **JWT** authentication via HTTP-only cookies.

---

## Prerequisites

Install the following before you begin:

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | v18 or higher |
| [MongoDB](https://www.mongodb.com/) | Local install **or** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier) |
| Git | Latest |

> **Optional:** Clone and run the [frontend repo](../task-manager-frontend) to use the full UI (`http://localhost:5174`).

---

## Quick Start

### 1. Clone the repository

```bash
git clone <your-backend-repo-url>
cd task-manager-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and configure:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=your_random_secret_key_here
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

**MongoDB options:**

- **Local:** `mongodb://127.0.0.1:27017/task-manager` (ensure MongoDB is running)
- **Atlas:** `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/task-manager`

### 4. Start the server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

Expected output:

```
MongoDB connected: ...
Server running on port 5000
```

### 5. Verify the API

```bash
curl http://localhost:5000/
```

Response:

```json
{ "message": "Task Management API running" }
```

---

## Create an Admin User

Registration creates accounts with the `user` role. Admin routes require `role: "admin"`.

### Option A — Seed script (recommended)

```bash
npm run seed:admin
```

Default credentials (override via env vars):

| Field | Default |
|-------|---------|
| Name | `Admin User` |
| Email | `admin@test.com` |
| Password | `admin123` |

Custom values:

```bash
ADMIN_NAME="Jane Admin" ADMIN_EMAIL="jane@admin.com" ADMIN_PASSWORD="securepass" npm run seed:admin
```

### Option B — Manual (MongoDB)

1. Register a user via API or frontend.
2. In MongoDB Compass or `mongosh`:

```js
use task-manager
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

3. Log out and log back in.

---

## Run with Frontend

1. Start this backend on port **5000**.
2. Start the frontend (typically `http://localhost:5174`).
3. Frontend should point to `http://localhost:5000/api` (default in `axios` config).

CORS is configured for `http://localhost:5174`. If the frontend runs on a different port, update `origin` in `server.js`.

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Create a new account |
| `POST` | `/login` | Public | Login and receive JWT cookie |
| `POST` | `/logout` | Protected | Clear cookie |
| `GET` | `/me` | Protected | Get current logged-in user |

**Login / Register body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

> Login uses `email` and `password` (not `username`).

---

### Tasks — `/api/tasks`

All routes require authentication (JWT cookie).

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | User | Create a new task |
| `GET` | `/` | User | Get only my tasks |
| `PUT` | `/:id` | User | Update my own task |
| `DELETE` | `/:id` | User | Delete my own task |

**Create task body:**

```json
{
  "title": "Finish README",
  "description": "Write setup instructions",
  "status": "pending"
}
```

Status values: `pending`, `in-progress`, `completed`

---

### Admin — `/api/admin`

All routes require authentication **and** `role: "admin"`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all users |
| `DELETE` | `/users/:id` | Delete a user |
| `PUT` | `/users/:id/status` | Set user active/inactive |
| `GET` | `/tasks` | Get all tasks (everyone's) |
| `DELETE` | `/tasks/:id` | Delete any task |
| `GET` | `/logs` | Get all activity logs |

**Update user status body:**

```json
{ "status": "active" }
```

or

```json
{ "status": "inactive" }
```

---

## Example API Calls

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"user@test.com","password":"password123"}'
```

### Login (saves cookie)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}' \
  -c cookies.txt
```

### Get my tasks

```bash
curl http://localhost:5000/api/tasks -b cookies.txt
```

### Create a task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"My first task","description":"Hello world"}'
```

---

## Project Structure

```
task-manager-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Register, login, logout
│   ├── taskController.js  # User task CRUD
│   ├── adminController.js # Admin user & task management
│   └── activityController.js
├── middleware/
│   ├── authMiddleware.js  # JWT verification
│   └── adminMiddleware.js # Admin role check
├── models/
│   ├── User.js
│   ├── Task.js
│   └── ActivityLog.js
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   └── adminRoutes.js
├── scripts/
│   └── seedAdmin.js       # Create first admin user
├── server.js              # App entry point
├── .env.example
└── package.json
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongoDB connection error` | Ensure MongoDB is running; verify `MONGO_URI` in `.env` |
| CORS error from frontend | Frontend must run on `http://localhost:5174`, or update CORS `origin` in `server.js` |
| `User not found` on login | Use `email` in the request body; check the account exists |
| `Invalid password` | Wrong password — reset or register a new account |
| Admin routes return `403` | Promote user to `role: "admin"` (see [Create an Admin User](#create-an-admin-user)) |
| Port `5000` already in use | Change `PORT` in `.env` or stop the conflicting process |

---

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (HTTP-only cookies) + bcrypt
- **Access control:** Role-based (`user` / `admin`)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (development) |
| `npm start` | Start server (production) |
| `npm run seed:admin` | Create or promote an admin user |
