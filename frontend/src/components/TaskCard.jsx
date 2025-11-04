import { useState, useRef, memo } from 'react'
import { createPortal } from 'react-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './TaskCard.css'
import Alert from './Alert'
import ConfirmDialog from './ConfirmDialog'
import TaskModal from './TaskModal'
import api from '../utils/api'

// API URL for passing to TaskModal component
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000')

const TaskCard = memo(({ task, column, onUpdate, onDelete }) => {
  // State: UI states for delete, edit, and alert
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [alert, setAlert] = useState({ isOpen: false, message: '', type: 'error' })
  
  // Refs: button references to prevent drag when clicking buttons
  const deleteButtonRef = useRef(null)
  const editButtonRef = useRef(null)

  // Drag and drop: configure sortable with disabled state when modals are open
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    disabled: isDeleting || showDeleteConfirm || showEditModal
  })

  // Drag prevention: stop drag when clicking delete button
  const handleDeleteButtonMouseDown = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handleDeleteButtonClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    handleDeleteClick()
  }

  // Style: apply drag transform and transition
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  // Handler: show delete confirmation dialog
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  // Handler: confirm and execute task deletion
  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false)
    setIsDeleting(true)
    
    try {
      await api.delete(`/api/tasks/${task.id}`)
      // Notify parent to refresh task list
      onDelete()
    } catch (error) {
      console.error('Error deleting task:', error)
      setAlert({
        isOpen: true,
        message: 'Gagal menghapus tugas. Silakan coba lagi.',
        type: 'error'
      })
      setIsDeleting(false)
    }
  }

  // Handler: cancel delete operation
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  // Handler: open edit modal
  const handleEditClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setShowEditModal(true)
  }

  // Drag prevention: stop drag when clicking edit button
  const handleEditButtonMouseDown = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  // Handler: refresh tasks after update and close modal
  const handleTaskUpdated = async () => {
    // Refresh tasks from server first
    if (onUpdate) {
      await onUpdate()
    }
    // Close modal after data is refreshed
    setShowEditModal(false)
  }

  // Custom drag listeners: prevent drag when clicking buttons or when modals are open
  const customListeners = (showDeleteConfirm || showEditModal) ? {} : {
    ...listeners,
    onPointerDown: (e) => {
      // Prevent drag if clicking on delete/edit buttons or elements with data-no-drag
      const target = e.target
      const deleteButton = deleteButtonRef.current
      const editButton = editButtonRef.current
      
      if (
        (deleteButton && 
         (deleteButton.contains(target) || 
          target.closest('.btn-delete') || 
          target === deleteButton)) ||
        (editButton && 
         (editButton.contains(target) || 
          target.closest('.btn-edit') || 
          target === editButton)) ||
        target.closest('[data-no-drag="true"]')
      ) {
        e.stopPropagation()
        e.preventDefault()
        return
      }
      // Call original drag handler if not clicking on buttons
      if (listeners?.onPointerDown) {
        listeners.onPointerDown(e)
      }
    },
    onMouseDown: (e) => {
      // Don't start drag if clicking on delete button
      const target = e.target
      const deleteButton = deleteButtonRef.current
      
      const editButton = editButtonRef.current
      
      if (
        (deleteButton && 
         (deleteButton.contains(target) || 
          target.closest('.btn-delete') || 
          target === deleteButton)) ||
        (editButton && 
         (editButton.contains(target) || 
          target.closest('.btn-edit') || 
          target === editButton)) ||
        target.closest('[data-no-drag="true"]')
      ) {
        e.stopPropagation()
        e.preventDefault()
        return
      }
      // Call original handler
      if (listeners?.onMouseDown) {
        listeners.onMouseDown(e)
      }
    },
    onTouchStart: (e) => {
      // Don't start drag if touching delete button
      const target = e.target
      const deleteButton = deleteButtonRef.current
      
      const editButton = editButtonRef.current
      
      if (
        (deleteButton && 
         (deleteButton.contains(target) || 
          target.closest('.btn-delete') || 
          target === deleteButton)) ||
        (editButton && 
         (editButton.contains(target) || 
          target.closest('.btn-edit') || 
          target === editButton)) ||
        target.closest('[data-no-drag="true"]')
      ) {
        e.stopPropagation()
        e.preventDefault()
        return
      }
      // Call original handler
      if (listeners?.onTouchStart) {
        listeners.onTouchStart(e)
      }
    }
  }

  const cardStyle = {
    ...style,
    backgroundColor: column?.cardBg || '#334155',
    color: column?.titleColor || '#F1F5F9'
  }

  const titleStyle = {
    color: column?.titleColor || '#F1F5F9'
  }

  const descStyle = {
    color: column?.descColor || '#CBD5E1'
  }

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`task-card ${isDragging ? 'task-card-dragging' : ''}`}
      {...attributes}
      {...customListeners}
    >
      <div className="task-header">
        <h3 className="task-title" style={titleStyle}>
          {task.title}
        </h3>
        <div className="task-actions">
          <button
            ref={editButtonRef}
            className="btn-edit"
            data-no-drag="true"
            onClick={handleEditClick}
            onMouseDown={handleEditButtonMouseDown}
            onTouchStart={handleEditButtonMouseDown}
            onPointerDown={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            disabled={isDeleting}
            title="Edit task"
            type="button"
          >
            ✎
          </button>
          <button
            ref={deleteButtonRef}
            className="btn-delete"
            data-no-drag="true"
            onClick={handleDeleteButtonClick}
            onMouseDown={handleDeleteButtonMouseDown}
            onTouchStart={handleDeleteButtonMouseDown}
            onPointerDown={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            disabled={isDeleting}
            title="Delete task"
            type="button"
          >
            ×
          </button>
        </div>
      </div>
      
      {task.description && (
        <div className="task-card-content">
          <p className="task-description" style={descStyle}>{task.description}</p>
        </div>
      )}
      
      {!task.description && (
        <div 
          className="task-card-content"
          style={{ minHeight: '20px' }}
        />
      )}

      {createPortal(
        <Alert
          isOpen={alert.isOpen}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, isOpen: false })}
        />,
        document.body
      )}

      {createPortal(
        <TaskModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onTaskUpdated={handleTaskUpdated}
          apiUrl={API_URL}
          task={task}
        />,
        document.body
      )}

      {createPortal(
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Hapus Tugas"
          message="Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan."
          confirmText="Hapus"
          cancelText="Batal"
          type="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />,
        document.body
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Memo comparison: prevent unnecessary re-renders
  // Returns true if props are equal (skip re-render), false if different (re-render needed)
  
  // Normalize description for comparison (handle null/undefined/empty string)
  const prevDesc = prevProps.task.description || ''
  const nextDesc = nextProps.task.description || ''
  
  // Check if task properties changed
  const tasksEqual = 
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevDesc === nextDesc &&
    prevProps.task.status === nextProps.task.status
  
  // Check if column changed
  const columnsEqual = prevProps.column?.id === nextProps.column?.id
  
  // Skip re-render if both task and column are unchanged
  return tasksEqual && columnsEqual
})

TaskCard.displayName = 'TaskCard'

export default TaskCard

