const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validators');

// Routes: CRUD operations for tasks
// POST /api/tasks - Create new task (with validation)
router.post('/', validateCreateTask, taskController.createTask);
// GET /api/tasks - Get all tasks grouped by status
router.get('/', taskController.getAllTasks);
// PUT /api/tasks/:id - Update task (with validation)
router.put('/:id', validateUpdateTask, taskController.updateTask);
// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;

