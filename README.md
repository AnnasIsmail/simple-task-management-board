# Simple Task Management Board

A full-stack application for simple task management (similar to Trello/Kanban board) that allows users to create, view, update, and delete tasks.

## 📋 Tech Stack

- **Backend**: Express.js, Sequelize, PostgreSQL
- **Frontend**: React.js, Vite, Axios
- **Infrastructure**: Docker, Docker Compose
- **Styling**: CSS3

## ✨ Features

- ✅ Kanban Board view with 3 columns: "To Do", "In Progress", "Done"
- ✅ Create new tasks with title and description
- ✅ Update task status through drag and drop
- ✅ Edit task title and description
- ✅ Delete tasks with confirmation
- ✅ Input validation (title is required)
- ✅ Centralized error handling
- ✅ Responsive design
- ✅ Drag and drop support (with @dnd-kit)

## 📁 Project Structure

```
kalachakra/
├── backend/              # Backend API (Express.js + Sequelize)
│   ├── config/          # Database and Sequelize configuration
│   ├── controllers/     # Controllers for business logic
│   ├── migrations/      # Database migrations
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── middleware/      # Middleware (error handling, validators)
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── frontend/            # Frontend React App
│   ├── src/
│   │   ├── components/  # React components (Board, Column, TaskCard, TaskModal, Alert, ConfirmDialog)
│   │   ├── utils/       # Utility functions (api.js for axios configuration)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile       # Multi-stage build with nginx
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml   # Docker Compose configuration
├── env.example          # Example environment variables file
└── README.md            # Main documentation
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- Node.js 18+ (for local development)

### Running with Docker (Recommended)

**With a single command:**

```bash
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Database**: PostgreSQL on port 5432

### Running in Background

```bash
docker-compose up -d --build
```

### Stopping the Application

```bash
docker-compose down
```

To also remove database data:

```bash
docker-compose down -v
```

## ⚙️ Environment Variables

Copy `env.example` to `.env` and adjust if needed:

```bash
cp env.example .env
```

### Available Variables:

- `DB_USER`: PostgreSQL database username (default: postgres)
- `DB_PASSWORD`: PostgreSQL database password (default: postgres)
- `DB_NAME`: Database name (default: taskmanagement)
- `DB_HOST`: Database host (default: db)
- `DB_PORT`: Database port (default: 5432)
- `NODE_ENV`: Node.js environment (development/production)
- `BACKEND_PORT`: Backend API port (default: 3000)
- `FRONTEND_PORT`: Frontend port (default: 8080)
- `FRONTEND_API_URL`: Backend URL for frontend (default: http://localhost:3000)
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins (optional, defaults to common development origins)

## 🔧 Development

### Running Backend Separately

```bash
cd backend
npm install
npm run dev
```

Make sure PostgreSQL is running and set environment variables in `.env`.

### Running Frontend Separately

```bash
cd frontend
npm install
npm run dev
```

Make sure the backend API is running at http://localhost:3000.

### Database Migrations

Migrations will run automatically when the backend container starts. To run manually:

```bash
# Inside backend container
docker-compose exec backend npm run migrate

# Or locally (if sequelize-cli is installed)
cd backend
npx sequelize-cli db:migrate
```

To rollback migration:

```bash
docker-compose exec backend npm run migrate:undo
```

## 📡 API Endpoints

### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description (optional)"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Task Title",
  "description": "Task Description",
  "status": "To Do",
  "createdAt": "2024-11-01T00:00:00.000Z",
  "updatedAt": "2024-11-01T00:00:00.000Z"
}
```

### GET /api/tasks
Get all tasks grouped by status.

**Response:**
```json
{
  "To Do": [
    { "id": "uuid", "title": "Task A", "description": "...", "status": "To Do", ... }
  ],
  "In Progress": [
    { "id": "uuid", "title": "Task B", "description": "...", "status": "In Progress", ... }
  ],
  "Done": [
    { "id": "uuid", "title": "Task C", "description": "...", "status": "Done", ... }
  ]
}
```

### PUT /api/tasks/:id
Update a task (title, description, or status).

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "status": "In Progress"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated Description",
  "status": "In Progress",
  "createdAt": "2024-11-01T00:00:00.000Z",
  "updatedAt": "2024-11-01T00:00:00.000Z"
}
```

### DELETE /api/tasks/:id
Delete a task.

**Response:** 204 No Content

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 📊 Task Model

- `id`: UUID (primary key)
- `title`: String (required, cannot be empty)
- `description`: Text (optional)
- `status`: Enum ('To Do', 'In Progress', 'Done') - default: 'To Do'
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## 🧪 Testing

1. **Create New Task:**
   - Click the "Add Task" button
   - Fill in title (required) and description (optional)
   - Submit form

2. **Change Status:**
   - Drag and drop task card to another column
   - Task will automatically move to the appropriate column

3. **Delete Task:**
   - Click the "×" button in the top right of task card
   - Confirm deletion

## 🔍 Troubleshooting

### Database connection error
- Make sure the `db` service is running and healthy
- Check environment variables in `.env`
- Wait a few seconds after `docker-compose up` for the database to be ready
- Make sure port 5432 is not used by another application

### Port already in use
- Change port in `.env` or docker-compose.yml
- Or stop the service using that port

### Frontend cannot connect to backend
- Make sure `FRONTEND_API_URL` in `.env` matches the backend URL
- For local development: `http://localhost:3000`
- For Docker: `http://backend:3000` (internal) or `http://localhost:3000` (external)
- Check CORS settings in backend

### Migration errors
- Make sure the database is running before running migrations
- Check database connection in `backend/config/database.js`
- To reset database: `docker-compose down -v` then `docker-compose up --build`

## 📚 Further Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 📝 License

ISC
