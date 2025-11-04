# Frontend - Task Management Board

Frontend application for Simple Task Management Board built with React.js and Vite.

## 📋 Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **HTTP Client**: Axios 1.6.2
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **Web Server**: Nginx (for production)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Alert.jsx        # Component for displaying alerts/notifications
│   │   ├── Board.jsx        # Main Kanban Board component
│   │   ├── Column.jsx       # Component for columns (To Do, In Progress, Done)
│   │   ├── ConfirmDialog.jsx # Confirmation dialog for delete
│   │   ├── TaskCard.jsx     # Card for displaying task
│   │   └── TaskModal.jsx    # Modal for create/edit task
│   ├── utils/               # Utility functions
│   │   └── api.js           # Axios instance configuration
│   ├── App.jsx              # Main application component
│   ├── App.css              # Styling for App
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── Dockerfile               # Multi-stage build with nginx
├── nginx.conf               # Nginx configuration
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## 🚀 Installation

```bash
npm install
```

## 💻 Development

Run the application in development mode:

```bash
npm run dev
```

The application will run at http://localhost:5173 (default Vite port).

**Note**: Make sure the backend API is running at http://localhost:3000 or set the `VITE_API_URL` environment variable.

## 🏗️ Build

Build for production:

```bash
npm run build
```

Output will be saved in the `dist/` folder.

## 👀 Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 🌐 Environment Variables

Create a `.env` file in the frontend folder (or set in system):

```env
VITE_API_URL=http://localhost:3000
```

Or use environment variables from the root `.env` file that are injected through Docker.

## 📦 Dependencies

### Production Dependencies

- **react**: ^18.2.0 - React library for UI
- **react-dom**: ^18.2.0 - React DOM renderer
- **axios**: ^1.6.2 - HTTP client for API calls
- **@dnd-kit/core**: ^6.1.0 - Core library for drag and drop
- **@dnd-kit/sortable**: ^8.0.0 - Sortable utilities for drag and drop
- **@dnd-kit/utilities**: ^3.2.2 - Utility functions for @dnd-kit

### Development Dependencies

- **@vitejs/plugin-react**: ^4.2.1 - Vite plugin for React
- **vite**: ^5.0.8 - Build tool and dev server
- **@types/react**: ^18.2.43 - TypeScript types for React
- **@types/react-dom**: ^18.2.17 - TypeScript types for React DOM

## 🎨 Components

### App.jsx
Main component that manages global state and API communication.

**Features:**
- State management for tasks
- Fetch tasks from API using Axios
- Handle create, update, delete operations
- Alert management
- Modal management

### Board.jsx
Kanban Board component that displays 3 columns (To Do, In Progress, Done).

**Props:**
- `tasks`: Object with structure `{ 'To Do': [], 'In Progress': [], 'Done': [] }`
- `onTaskUpdate`: Callback when task is updated
- `onTaskDelete`: Callback when task is deleted
- `onError`: Callback for error handling

### Column.jsx
Component for displaying columns in the board with drag and drop support.

**Props:**
- `column`: Column configuration object with `id`, `title`, colors, and styling
- `tasks`: Array of task objects in this column
- `onTaskUpdate`: Callback when task is updated (for refreshing list)
- `onTaskDelete`: Callback when task is deleted

### TaskCard.jsx
Card component for displaying individual tasks with drag and drop support.

**Props:**
- `task`: Task object with `id`, `title`, `description`, `status`
- `column`: Column object with styling configuration
- `onUpdate`: Callback when task is updated (for refreshing list)
- `onDelete`: Callback when task is deleted

### TaskModal.jsx
Modal for create/edit task.

**Props:**
- `isOpen`: Boolean to show/hide modal
- `onClose`: Callback to close modal
- `onTaskCreated`: Callback after task is successfully created
- `task`: Task object (optional, for edit mode)

### Alert.jsx
Component for displaying alerts/notifications.

**Props:**
- `isOpen`: Boolean to show/hide alert
- `message`: Message to display
- `type`: Alert type ('error', 'success', 'info', 'warning')
- `onClose`: Callback to close alert

### ConfirmDialog.jsx
Confirmation dialog for actions like delete.

**Props:**
- `isOpen`: Boolean to show/hide dialog
- `message`: Confirmation message
- `onConfirm`: Callback when confirmed
- `onCancel`: Callback when cancelled

## 🔌 API Integration

Frontend communicates with backend through REST API using Axios. Endpoints used:

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

**Axios Configuration:**
- Axios instance is configured in `src/utils/api.js`
- Base URL is set automatically based on environment (production uses relative URL via nginx proxy)
- Default headers include `Content-Type: application/json`

API URL is configured through the `VITE_API_URL` environment variable or defaults to `http://localhost:3000` for development.

## 🐳 Docker

Frontend uses multi-stage Docker build:

1. **Build stage**: Build application with Vite
2. **Production stage**: Serve static files with Nginx

### Build Image

```bash
docker build -t task-management-frontend .
```

### Run Container

```bash
docker run -p 8080:80 task-management-frontend
```

## 📱 Responsive Design

The application is designed to be responsive and can be used on various screen sizes:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎯 Features

- ✅ Kanban Board with 3 columns
- ✅ Create task with validation
- ✅ Update task (title, description, status)
- ✅ Delete task with confirmation
- ✅ Drag and drop support
- ✅ Error handling and alert notifications
- ✅ Responsive design
- ✅ Loading states

## 🔧 Development Tips

1. **Hot Module Replacement (HMR)**: Vite provides HMR for fast development
2. **API Proxy**: For development, make sure the backend is running on port 3000
3. **Environment Variables**: Use the `VITE_` prefix for environment variables that need to be accessed in the browser
4. **Build Optimization**: Vite automatically performs code splitting and optimization for production builds

## 📝 Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

### Port 5173 already in use
- Vite will automatically find another port
- Or set port manually: `npm run dev -- --port 3001`

### API connection error
- Make sure the backend is running at http://localhost:3000
- Check CORS settings in backend
- Verify `VITE_API_URL` environment variable

### Build errors
- Delete `node_modules` and `dist` folder
- Run `npm install` again
- Check for syntax errors in code

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [Axios Documentation](https://axios-http.com/)

## 📝 License

ISC
