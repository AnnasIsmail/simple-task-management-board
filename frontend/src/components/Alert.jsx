import './Alert.css'

const Alert = ({ message, type = 'error', isOpen, onClose }) => {
  if (!isOpen || !message) return null

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className={`alert-box alert-${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="alert-header">
          <span className="alert-icon">
            {type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
          </span>
          <h3 className="alert-title">
            {type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info'}
          </h3>
        </div>
        <div className="alert-body">
          <p>{message}</p>
        </div>
        <div className="alert-footer">
          <button className="alert-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default Alert

