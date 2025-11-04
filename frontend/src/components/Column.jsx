import { memo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import './Column.css'

const Column = memo(({ column, tasks, onTaskUpdate, onTaskDelete }) => {
  // Drag and drop: configure droppable area for this column
  const { setNodeRef, isOver } = useDroppable({
    id: column.id
  })

  return (
    <div 
      className={`column ${isOver ? 'column-drag-over' : ''}`} 
      style={{ 
        backgroundColor: column.bgColor || '#1E293B',
        borderTopColor: column.color,
        borderLeftColor: column.color,
        borderRightColor: column.color
      }}
    >
      <div className="column-header" style={{ backgroundColor: column.bgColor }}>
        <h2>{column.title}</h2>
        <span 
          className="task-count" 
          style={{ 
            color: column.badgeColor || '#60A5FA'
          }}
        >
          {tasks.length}
        </span>
      </div>
      {/* Droppable area: tasks can be dropped here */}
      <div className="column-body" ref={setNodeRef}>
        {tasks.length === 0 ? (
          // Empty state: show placeholder when no tasks or when dragging over
          <div className={`empty-column ${isOver ? 'empty-column-drag-over' : ''}`}>
            {isOver ? 'Drop task here' : 'No tasks'}
          </div>
        ) : (
          // Sortable context: enable drag and drop for tasks within column
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                column={column}
                onUpdate={onTaskUpdate}
                onDelete={onTaskDelete}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Memo comparison: prevent unnecessary re-renders
  // Returns true if props are equal (skip re-render), false if different (re-render needed)
  
  // Early return: column changed, need re-render
  if (prevProps.column.id !== nextProps.column.id) {
    return false
  }
  
  // Early return: task count changed, need re-render
  if (prevProps.tasks.length !== nextProps.tasks.length) {
    return false
  }
  
  // Deep comparison: check if all task properties are unchanged
  const tasksEqual = prevProps.tasks.every((task, index) => {
    const nextTask = nextProps.tasks[index]
    if (!nextTask) return false
    
    // Normalize description for comparison (handle null/undefined/empty string)
    const prevDesc = task.description || ''
    const nextDesc = nextTask.description || ''
    
    // Compare all task properties
  return (
      task.id === nextTask.id &&
      task.title === nextTask.title &&
      prevDesc === nextDesc &&
      task.status === nextTask.status
    )
  })
  
  // Skip re-render if tasks are unchanged
  return tasksEqual
})

Column.displayName = 'Column'

export default Column

