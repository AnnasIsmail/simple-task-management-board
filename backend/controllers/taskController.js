const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    
    // Create task with default status 'To Do'
    const task = await Task.create({
      title,
      description: description || null,
      status: 'To Do' // Default status for new tasks
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Get all tasks grouped by status
exports.getAllTasks = async (req, res, next) => {
  try {
    // Fetch all tasks ordered by creation date (newest first)
    const tasks = await Task.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Group tasks by status for Kanban board display
    const groupedTasks = {
      'To Do': [],
      'In Progress': [],
      'Done': []
    };

    tasks.forEach(task => {
      groupedTasks[task.status].push(task);
    });

    res.json(groupedTasks);
  } catch (error) {
    next(error);
  }
};

// Update a task
exports.updateTask = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, status } = req.body;

    // Find task by ID
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update only provided fields (partial update)
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find task by ID
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Delete task from database
    await task.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

