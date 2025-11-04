import './ConfirmDialog.css'

const ConfirmDialog = ({ 
  isOpen, 
  title = 'Confirm Action', 
  message, 
  confirmText = 'Yes', 
  cancelText = 'Cancel',
  onConfirm, 
  onCancel,
  type = 'danger'
}) => {
  if (!isOpen) return null

  const handleConfirm = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onConfirm()
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onCancel()
  }

  const handleOverlayClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onCancel()
  }

  const handleDialogClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handleMouseDown = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handlePointerDown = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div 
      className="confirm-overlay" 
      onClick={handleOverlayClick}
      onMouseDown={handleMouseDown}
      onPointerDown={handlePointerDown}
      onTouchStart={handleMouseDown}
    >
      <div 
        className="confirm-dialog" 
        onClick={handleDialogClick}
        onMouseDown={handleMouseDown}
        onPointerDown={handlePointerDown}
        onTouchStart={handleMouseDown}
      >
        <div className="confirm-header">
          <span className="confirm-icon">
            {type === 'danger' ? '⚠️' : 'ℹ️'}
          </span>
          <h3 className="confirm-title">{title}</h3>
        </div>
        <div className="confirm-body">
          <p>{message}</p>
        </div>
        <div className="confirm-footer">
          <button 
            className="confirm-button confirm-button-cancel" 
            onClick={handleCancel}
            onMouseDown={handleMouseDown}
            onPointerDown={handlePointerDown}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-button confirm-button-${type}`} 
            onClick={handleConfirm}
            onMouseDown={handleMouseDown}
            onPointerDown={handlePointerDown}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

