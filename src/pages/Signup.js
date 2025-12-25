import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link as MuiLink,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'

const Signup = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const { signup, login, isAuthenticated } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const getByteLength = (str) => {
    try {
      // Use UTF-8 encoding to get accurate byte length
      return new TextEncoder().encode(str).length
    } catch (_e) {
      // Fallback to character length if encoding fails
      return str.length
    }
  }

 const validatePassword = (password) => {
  if (!password) return "Password is required";

  // bcrypt hard limit
  if (new TextEncoder().encode(password).length > 72) {
    return "Password must be at most 72 characters";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  // Check for required character types
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);

  if (!hasUpper || !hasLower || !hasDigit) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one digit";
  }

  return "";
};


  const handleChange = (e) => {
    const { name, value } = e.target
    const nextFormData = {
      ...formData,
      [name]: value
    }
    setFormData(nextFormData)

    if (error) setError('')

    // Derive validation/mismatch from next state to avoid stale comparisons
    const strengthErr = validatePassword(nextFormData.password)
    const mismatch =
      nextFormData.password &&
      nextFormData.confirmPassword &&
      nextFormData.password !== nextFormData.confirmPassword

    const finalError = strengthErr ? strengthErr : (mismatch ? 'Passwords do not match' : '')
    setPasswordError(finalError)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')


    const passwordBytes = new TextEncoder().encode(formData.password).length;

    if (passwordBytes > 72) {
      setError("Password too long (max 72 characters)");
      setLoading(false);
      return; // ❗ DO NOT REMOVE
    }
 
    try {
      
      
     // ✅ Check mismatch FIRST
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
      setLoading(false)
      return
    }

    const signupResult = await signup(
      formData.fullName,
      formData.email,
      formData.password
    )

    if (signupResult.success) {
      // Automatically login after successful signup
      const loginResult = await login(formData.email, formData.password)
      if (loginResult.success) {
        navigate('/dashboard')
      } else {
        // If auto-login fails, redirect to login page
        navigate('/login')
      }
    } else {
      setError(signupResult.error || 'Signup failed')
    }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.email && formData.password && formData.confirmPassword &&
                      formData.fullName && !passwordError && !loading && !error

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        py: 4
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Create Account
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Join thousands of users finding their perfect PC setup
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              error={!!passwordError}
              helperText={passwordError || (formData.password ? `${getByteLength(formData.password)}/72 bytes` : '')}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              error={!!passwordError}
              helperText={passwordError === 'Passwords do not match' ? passwordError : ''}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isFormValid}
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <MuiLink component={Link} to="/login" variant="body2">
                {"Already have an account? Sign In"}
              </MuiLink>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink component={Link} to="/" variant="body2">
                {"← Back to Home"}
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Signup
