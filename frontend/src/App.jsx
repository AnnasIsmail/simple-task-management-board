import { useState, useEffect } from 'react'
import Board from './components/Board'
import TaskModal from './components/TaskModal'
import Alert from './components/Alert'
import api from './utils/api'
import './App.css'

// API URL for passing to components that need it
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000')

function App() {
  // State: tasks grouped by status for Kanban board display
  const [tasks, setTasks] = useState({
    'To Do': [],
    'In Progress': [],
    'Done': []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alert, setAlert] = useState({ isOpen: false, message: '', type: 'error' })

  /**
   * Fetch tasks from API using Axios
   * @param {boolean} silent - If true, don't show loading indicator (for silent refreshes)
   */
  const fetchTasks = async (silent = false) => {
    try {
      // Show loading indicator only if not silent mode
      if (!silent) {
        setLoading(true)
      }
      setError(null)
      // Use axios instance from utils/api.js
      const response = await api.get('/api/tasks')
      setTasks(response.data)
    } catch (err) {
      // Axios provides error.response for server errors
      setError(err.response?.data?.error || err.message || 'Failed to fetch tasks')
      console.error('Error fetching tasks:', err)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  // Handler: refresh tasks after creation and close modal
  const handleTaskCreated = async () => {
    await fetchTasks(true)
    setIsModalOpen(false)
  }

  // Handler: refresh tasks after update (silent to avoid loading flicker)
  const handleTaskUpdated = async () => {
    await fetchTasks(true)
  }

  // Handler: refresh tasks after deletion
  const handleTaskDeleted = async () => {
    await fetchTasks(true)
  }

  // Handler: display error alert from board component
  const handleBoardError = (message) => {
    setAlert({
      isOpen: true,
      message,
      type: 'error'
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span className="header-icon">📋</span>
          Task Management Board
        </h1>
        <button 
          className="btn-add-task"
          onClick={() => setIsModalOpen(true)}
        >
          + Tambah Tugas
        </button>
      </header>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <Board 
          tasks={tasks}
          setTasks={setTasks}
          onTaskUpdate={handleTaskUpdated}
          onTaskDelete={handleTaskDeleted}
          onError={handleBoardError}
        />
      )}

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
          apiUrl={API_URL}
        />
      )}

      <Alert
        isOpen={alert.isOpen}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
    </div>
  )
}

export default App

