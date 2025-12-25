import React, { useState, useEffect } from 'react'
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton
} from '@mui/material'
// import {
//   Close as CloseIcon,
//   CheckCircle as SuccessIcon,
//   Error as ErrorIcon,
//   Warning as WarningIcon,
//   Info as InfoIcon
// } from '@mui/icons-material'

const Toast = ({
  open,
  onClose,
  message,
  severity = 'info',
  title,
  autoHideDuration = 6000,
  action
}) => {
  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setIsOpen(false)
    onClose && onClose(event, reason)
  }

  const getIcon = () => {
    switch (severity) {
      case 'success':
        return '✅' // <SuccessIcon />
      case 'error':
        return '❌' // <ErrorIcon />
      case 'warning':
        return '⚠️' // <WarningIcon />
      case 'info':
      default:
        return 'ℹ️' // <InfoIcon />
    }
  }

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        icon={getIcon()}
        action={
          action || (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              {/* <CloseIcon fontSize="small" /> */}✕
            </IconButton>
          )
        }
        sx={{ minWidth: 300 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Toast
