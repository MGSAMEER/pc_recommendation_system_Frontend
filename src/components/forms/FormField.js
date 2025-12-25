import React from 'react'
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
  Box,
  useTheme
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material'

/**
 * FormField - Enhanced TextField with built-in validation feedback
 * Provides real-time validation, error states, and success indicators
 */
const FormField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  success,
  successMessage,
  type = 'text',
  required = false,
  disabled = false,
  multiline = false,
  rows = 1,
  placeholder,
  startAdornment,
  endAdornment,
  showPasswordToggle = false,
  validationRules = [],
  validateOnChange = false,
  validateOnBlur = true,
  sx = {},
  ...props
}) => {
  const theme = useTheme()
  const [showPassword, setShowPassword] = React.useState(false)
  const [fieldError, setFieldError] = React.useState('')
  const [fieldSuccess, setFieldSuccess] = React.useState(false)
  const [touched, setTouched] = React.useState(false)

  // Combine external error with internal validation
  const displayError = error || (touched && fieldError)
  const displaySuccess = success || (touched && fieldSuccess && !displayError)

  // Handle input change with validation
  const handleChange = (event) => {
    const newValue = event.target.value
    onChange(event)

    if (validateOnChange) {
      validateField(newValue)
    }
  }

  // Handle blur with validation
  const handleBlur = (event) => {
    setTouched(true)
    onBlur && onBlur(event)

    if (validateOnBlur) {
      validateField(event.target.value)
    }
  }

  // Validate field against rules
  const validateField = (fieldValue) => {
    let hasError = false
    let hasSuccess = false

    // Required validation
    if (required && (!fieldValue || fieldValue.trim() === '')) {
      setFieldError(`${label} is required`)
      hasError = true
    } else {
      // Custom validation rules
      for (const rule of validationRules) {
        if (rule.validate && !rule.validate(fieldValue)) {
          setFieldError(rule.message)
          hasError = true
          break
        }
      }

      if (!hasError) {
        setFieldError('')
        hasSuccess = validationRules.length > 0
      }
    }

    setFieldSuccess(hasSuccess && !hasError)
    return !hasError
  }

  // Get helper text
  const getHelperText = () => {
    if (displayError) return fieldError || helperText
    if (displaySuccess) return successMessage || 'Valid'
    return helperText
  }

  // Get input props
  const getInputProps = () => {
    const inputProps = {}

    if (startAdornment) {
      inputProps.startAdornment = (
        <InputAdornment position="start">
          {startAdornment}
        </InputAdornment>
      )
    }

    if (endAdornment || showPasswordToggle || displaySuccess || displayError) {
      inputProps.endAdornment = (
        <InputAdornment position="end">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {endAdornment}
            {displaySuccess && <SuccessIcon color="success" fontSize="small" />}
            {displayError && <ErrorIcon color="error" fontSize="small" />}
            {showPasswordToggle && (
              <IconButton
                size="small"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            )}
          </Box>
        </InputAdornment>
      )
    }

    return inputProps
  }

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!displayError}
      helperText={getHelperText()}
      type={showPasswordToggle && showPassword ? 'text' : type}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      InputProps={getInputProps()}
      sx={{
        '& .MuiInputLabel-root': {
          color: displaySuccess ? theme.palette.success.main : undefined
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: displaySuccess ? theme.palette.success.main :
                         displayError ? theme.palette.error.main : undefined
          },
          '&:hover fieldset': {
            borderColor: displaySuccess ? theme.palette.success.main :
                         displayError ? theme.palette.error.main : undefined
          },
          '&.Mui-focused fieldset': {
            borderColor: displaySuccess ? theme.palette.success.main :
                         displayError ? theme.palette.error.main : undefined
          }
        },
        ...sx
      }}
      {...props}
    />
  )
}

/**
 * Predefined validation rules
 */
export const validationRules = {
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  password: {
    validate: (value) => value.length >= 8,
    message: 'Password must be at least 8 characters long'
  },
  strongPassword: {
    validate: (value) => {
      return value.length >= 8 &&
             /[a-z]/.test(value) &&
             /[A-Z]/.test(value) &&
             /\d/.test(value)
    },
    message: 'Password must contain uppercase, lowercase, and number'
  },
  phone: {
    validate: (value) => /^\+?[\d\s\-\(\)]{10,}$/.test(value),
    message: 'Please enter a valid phone number'
  },
  url: {
    validate: (value) => /^https?:\/\/.+\..+/.test(value),
    message: 'Please enter a valid URL'
  },
  required: {
    validate: (value) => value && value.trim() !== '',
    message: 'This field is required'
  },
  minLength: (min) => ({
    validate: (value) => value.length >= min,
    message: `Must be at least ${min} characters`
  }),
  maxLength: (max) => ({
    validate: (value) => value.length <= max,
    message: `Must be no more than ${max} characters`
  }),
  numeric: {
    validate: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
    message: 'Please enter a valid number'
  },
  positive: {
    validate: (value) => parseFloat(value) > 0,
    message: 'Must be a positive number'
  }
}

/**
 * FormField wrapper with common validation patterns
 */
export const EmailField = (props) => (
  <FormField
    type="email"
    validationRules={[validationRules.email]}
    {...props}
  />
)

export const PasswordField = (props) => (
  <FormField
    type="password"
    showPasswordToggle
    validationRules={[validationRules.password]}
    {...props}
  />
)

export const StrongPasswordField = (props) => (
  <FormField
    type="password"
    showPasswordToggle
    validationRules={[validationRules.strongPassword]}
    {...props}
  />
)

export const PhoneField = (props) => (
  <FormField
    type="tel"
    validationRules={[validationRules.phone]}
    {...props}
  />
)

export const NumberField = (props) => (
  <FormField
    type="number"
    validationRules={[validationRules.numeric]}
    {...props}
  />
)

export const UrlField = (props) => (
  <FormField
    type="url"
    validationRules={[validationRules.url]}
    {...props}
  />
)

export default FormField

