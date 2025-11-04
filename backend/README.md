# Backend - Task Management API

Backend API for Simple Task Management Board built with Express.js, Sequelize, and PostgreSQL.

## 📋 Tech Stack

- **Framework**: Express.js 4.18.2
- **ORM**: Sequelize 6.35.2
- **Database**: PostgreSQL 15
- **Validation**: express-validator 7.0.1
- **CORS**: cors 2.8.5
- **Environment**: dotenv 16.3.1
- **Migration Tool**: sequelize-cli 6.6.2

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js       # Database connection configuration
│   └── sequelize.js      # Sequelize instance
├── controllers/
│   └── taskController.js # Controller for task operations
├── middleware/
│   ├── errorHandler.js   # Global error handler middleware
│   └── validators.js     # Request validation middleware
├── migrations/
│   └── 20241101000001-create-tasks.js # Migration for tasks table
├── models/
│   └── Task.js           # Sequelize model for Task
├── routes/
│   └── taskRoutes.js     # API routes for tasks
├── Dockerfile            # Docker configuration
├── server.js             # Application entry point
└── package.json          # Dependencies and scripts
```

## 🚀 Installation

```bash
npm install
```

## 💻 Development

Run the application in development mode (with nodemon for auto-reload):

```bash
npm run dev
```

The application will run at http://localhost:3000 (or according to the `PORT` environment variable).

## 🏗️ Production

Run the application in production mode:

```bash
npm start
```

## 🌐 Environment Variables

Create a `.env` file in the backend folder (or set in system):

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=taskmanagement
DB_HOST=localhost
DB_PORT=5432

# Server Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration (optional)
# Comma-separated list of allowed origins
# Example: CORS_ORIGINS=http://localhost:5173,http://localhost:8080,https://yourdomain.com
# If not set, defaults to common development origins
CORS_ORIGINS=http://localhost:5173,http://localhost:8080
```

**Note**: 
- For Docker, `DB_HOST` must be set to `db` (service name in docker-compose).
- In development, CORS allows all origins for easier development.
- In production, only whitelisted origins in `CORS_ORIGINS` are allowed.

## 📦 Dependencies

### Production Dependencies

- **express**: ^4.18.2 - Web framework for Node.js
- **sequelize**: ^6.35.2 - ORM for SQL databases
- **pg**: ^8.11.3 - PostgreSQL client for Node.js
- **pg-hstore**: ^2.3.4 - Serialization for PostgreSQL hstore
- **express-validator**: ^7.0.1 - Middleware for request validation
- **cors**: ^2.8.5 - Middleware for CORS
- **dotenv**: ^16.3.1 - Load environment variables from .env file
- **sequelize-cli**: ^6.6.2 - CLI tools for Sequelize migrations

### Development Dependencies

- **nodemon**: ^3.0.2 - Auto-reload development server

## 🗄️ Database

### Model: Task

```javascript
{
  id: UUID (primary key, auto-generated)
  title: String (required, not empty)
  description: Text (optional)
  status: Enum('To Do', 'In Progress', 'Done') (default: 'To Do')
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Migrations

#### Running Migrations

```bash
npm run migrate
```

Or with sequelize-cli:

```bash
npx sequelize-cli db:migrate
```

#### Rollback Migration

```bash
npm run migrate:undo
```

Or with sequelize-cli:

```bash
npx sequelize-cli db:migrate:undo
```

## 📡 API Endpoints

### GET /api/tasks
Get all tasks grouped by status.

**Response:**
```json
{
  "To Do": [
    {
      "id": "uuid",
      "title": "Task Title",
      "description": "Task Description",
      "status": "To Do",
      "createdAt": "2024-11-01T00:00:00.000Z",
      "updatedAt": "2024-11-01T00:00:00.000Z"
    }
  ],
  "In Progress": [...],
  "Done": [...]
}
```

**Status Codes:**
- `200 OK` - Success

### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description (optional)"
}
```

**Validation:**
- `title`: Required, cannot be empty

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

**Status Codes:**
- `201 Created` - Success
- `400 Bad Request` - Validation error

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

**Validation:**
- `title`: If provided, cannot be empty
- `status`: Must be one of: 'To Do', 'In Progress', 'Done'

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

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Validation error
- `404 Not Found` - Task not found

### DELETE /api/tasks/:id
Delete a task.

**Response:** 
- `204 No Content` - Success
- `404 Not Found` - Task not found

### GET /health
Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

**Status Codes:**
- `200 OK` - Success

## 🏗️ Architecture

### Controllers

**taskController.js** - Handles business logic for task operations:
- `getAllTasks` - Get all tasks and group by status
- `createTask` - Create a new task
- `updateTask` - Update existing task
- `deleteTask` - Delete a task

### Middleware

**errorHandler.js** - Global error handler middleware:
- Catches all errors
- Sends consistent error responses
- Logs errors for debugging

**validators.js** - Request validation middleware:
- `validateTask` - Validation for create/update task
- Uses express-validator for validation

### Routes

**taskRoutes.js** - Defines all routes for tasks:
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Models

**Task.js** - Sequelize model for Task:
- Schema definition with validation
- Enum for status
- UUID as primary key

## 🔒 Error Handling

Backend uses centralized error handling through the `errorHandler.js` middleware. Error response format:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## 🐳 Docker

Backend uses Docker for containerization.

### Build Image

```bash
docker build -t task-management-backend .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e DB_HOST=db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=taskmanagement \
  task-management-backend
```

## 🔧 Configuration

### Database Connection

Database configuration is in `config/database.js` and `config/sequelize.js`. Connection uses environment variables for flexibility.

### CORS

CORS is configured with environment-based security:
- **Development**: Allows all origins for easier development
- **Production**: Only allows origins specified in `CORS_ORIGINS` environment variable

Default allowed origins in development:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:8080` (Frontend in Docker)
- `http://localhost:3000` (Direct backend access)

To configure production origins, set `CORS_ORIGINS` environment variable:
```env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 📝 Scripts

- `npm start` - Run the application in production mode
- `npm run dev` - Run the application in development mode (with nodemon)
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Rollback last migration

## 🧪 Testing API

### Using cURL

**Get all tasks:**
```bash
curl http://localhost:3000/api/tasks
```

**Create task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description"}'
```

**Update task:**
```bash
curl -X PUT http://localhost:3000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}'
```

**Delete task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/{task-id}
```

**Health check:**
```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

### Database connection error
- Make sure PostgreSQL is running
- Check environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT)
- Verify the database has been created
- Check network connectivity if using Docker

### Port already in use
- Change the `PORT` environment variable
- Or stop the service using that port
- Check: `lsof -i :3000` (Linux/Mac) or `netstat -ano | findstr :3000` (Windows)

### Migration errors
- Make sure database connection is successful
- Check migration file syntax
- Make sure there are no conflicting migrations
- To reset: drop the database and run migrations again

### Sequelize errors
- Make sure all dependencies are installed
- Check Sequelize version compatibility with PostgreSQL
- Verify model definitions match the database schema

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [express-validator Documentation](https://express-validator.github.io/docs/)

## 📝 License

ISC
