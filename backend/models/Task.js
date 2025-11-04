const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      },
      notNull: {
        msg: 'Title is required'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
    defaultValue: 'To Do',
    allowNull: false,
    validate: {
      isIn: {
        args: [['To Do', 'In Progress', 'Done']],
        msg: 'Status must be one of: To Do, In Progress, Done'
      }
    }
  }
}, {
  tableName: 'tasks',
  timestamps: true,
  underscored: false
});

module.exports = Task;

