const express = require('express');
const cors = require('cors');
const sequelize = require('./config/sequelize');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration: whitelist origins based on environment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Get allowed origins from environment variable or use defaults
    const allowedOrigins = process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : [
          // Development defaults
          'http://localhost:5173',  // Vite dev server
          'http://localhost:3000',   // Direct backend access
          'http://localhost:8080',   // Frontend in Docker
          'http://127.0.0.1:5173',
          'http://127.0.0.1:8080'
        ];

    // In production, only allow specified origins
    if (process.env.NODE_ENV === 'production') {
      // Production: only allow whitelisted origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development: allow all origins for easier development
      callback(null, true);
    }
  },
  credentials: true, // Allow cookies/credentials if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync models (only in development, use migrations in production)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

