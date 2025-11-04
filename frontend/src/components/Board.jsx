import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { useState } from 'react'
import Column from './Column'
import api from '../utils/api'
import './Board.css'

const Board = ({ tasks, setTasks, onTaskUpdate, onTaskDelete, onError }) => {
  // Track currently dragged task ID for drag overlay
  const [activeId, setActiveId] = useState(null)
  
  // Column configuration: status, colors, and styling for each Kanban column
  const columns = [
    { 
      id: 'To Do', 
      title: 'To Do', 
      color: '#3B82F6',
      bgColor: '#1E293B',
      cardBg: '#334155',
      titleColor: '#F1F5F9',
      descColor: '#CBD5E1',
      badgeColor: '#60A5FA'
    },
    { 
      id: 'In Progress', 
      title: 'In Progress', 
      color: '#F59E0B',
      bgColor: '#713F12',
      cardBg: '#78350F',
      titleColor: '#FEF3C7',
      descColor: '#FDE68A',
      badgeColor: '#FBBF24'
    },
    { 
      id: 'Done', 
      title: 'Done', 
      color: '#10B981',
      bgColor: '#14532D',
      cardBg: '#166534',
      titleColor: '#DCFCE7',
      descColor: '#BBF7D0',
      badgeColor: '#4ADE80'
    }
  ]

  // Handler: track which task is being dragged
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  // Handler: process drag end and update task status
  const handleDragEnd = async (event) => {
    const { active, over } = event
    
    // Early return: no drop target or dropped on itself
    if (!over || active.id === over.id) {
      setActiveId(null)
      return
    }

    const taskId = active.id
    const overId = over.id

    // Determine new status: check if dropped on column or on another task
    let newStatus = null
    
    // Case 1: dropped directly on a column
    const columnIds = columns.map(col => col.id)
    if (columnIds.includes(overId)) {
      newStatus = overId
    } else {
      // Case 2: dropped on another task - find which column that task belongs to
      for (const status of Object.keys(tasks)) {
        const found = tasks[status].find(t => t.id === overId)
        if (found) {
          newStatus = status
          break
        }
      }
    }

    // Early return: couldn't determine new status
    if (!newStatus) {
      setActiveId(null)
      return
    }

    // Find the dragged task and its current status
    let task = null
    let oldStatus = null
    for (const status of Object.keys(tasks)) {
      const found = tasks[status].find(t => t.id === taskId)
      if (found) {
        task = found
        oldStatus = status
        break
      }
    }

    // Early return: task not found or status unchanged
    if (!task || task.status === newStatus || oldStatus === newStatus) {
      setActiveId(null)
      return
    }

    // Clear active state immediately
    setActiveId(null)

    // Save current state for potential rollback on error
    const previousTasks = { ...tasks }

    // OPTIMISTIC UPDATE: update UI immediately for better UX
    const updatedTask = { ...task, status: newStatus }
    const newTasks = {
      ...tasks,
      [oldStatus]: tasks[oldStatus].filter(t => t.id !== taskId),
      [newStatus]: [...tasks[newStatus], updatedTask]
    }
    setTasks(newTasks)

    // Update task status via API in background
    api.put(`/api/tasks/${taskId}`, { status: newStatus })
      .then(async () => {
        // Sync with server in background (silent refresh)
      if (onTaskUpdate) {
        await onTaskUpdate()
      }
      })
      .catch(error => {
      console.error('Error updating task:', error)
        // Rollback: restore previous state on error
      setTasks(previousTasks)
      if (onError) {
        onError('Gagal memperbarui status tugas. Silakan coba lagi.')
      }
      // Refresh to restore correct state from server
      if (onTaskUpdate) {
      onTaskUpdate()
      }
    })
  }

  // Handler: clear active state when drag is cancelled
  const handleDragCancel = () => {
    setActiveId(null)
  }

  // Find active task for drag overlay display
  const activeTask = activeId ? (() => {
    for (const status of Object.keys(tasks)) {
      const found = tasks[status].find(t => t.id === activeId)
      if (found) return found
    }
    return null
  })() : null

  // Find column configuration for active task (for styling)
  const activeColumn = activeTask ? columns.find(col => col.id === activeTask.status) : null

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="board">
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks[column.id] || []}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && activeColumn ? (
          <div 
            className="task-card task-card-dragging"
            style={{
              backgroundColor: activeColumn.cardBg,
              color: activeColumn.titleColor
            }}
          >
            <div className="task-header">
              <h3 className="task-title" style={{ color: activeColumn.titleColor }}>
                {activeTask.title}
              </h3>
            </div>
            {activeTask.description && (
              <p className="task-description" style={{ color: activeColumn.descColor }}>
                {activeTask.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board

