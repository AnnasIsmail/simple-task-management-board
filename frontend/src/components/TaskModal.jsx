import { useState, useEffect } from 'react'
import api from '../utils/api'
import './TaskModal.css'

const TaskModal = ({ isOpen, onClose, onTaskCreated, onTaskUpdated, apiUrl, task = null }) => {
  // Determine mode: edit existing task or create new task
  const isEditMode = !!task
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load task data when modal opens in edit mode, reset form in create mode
  useEffect(() => {
    if (isOpen && task) {
      // Edit mode: populate form with existing task data
      setTitle(task.title || '')
      setDescription(task.description || '')
    } else if (isOpen && !task) {
      // Create mode: reset form to empty
      setTitle('')
      setDescription('')
    }
    setError('')
  }, [isOpen, task])

  // Handler: submit form to create or update task
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation: title is required
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Prepare request data
      const requestData = {
          title: title.trim(),
          description: description.trim() || null
      }

      // Create or update task based on mode
      if (isEditMode) {
        await api.put(`/api/tasks/${task.id}`, requestData)
      } else {
        await api.post('/api/tasks', requestData)
      }

      // Reset form after successful submission
      setTitle('')
      setDescription('')
      
      // Call callback to refresh task list (callback will close modal)
      if (isEditMode && onTaskUpdated) {
        await onTaskUpdated()
      } else if (!isEditMode && onTaskCreated) {
        await onTaskCreated()
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || `Failed to ${isEditMode ? 'update' : 'create'} task`)
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} task:`, err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Tugas' : 'Tambah Tugas Baru'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {error && (
            <div className="form-error">{error}</div>
          )}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal

