import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useAuth } from '../hooks/useAuth'
import { useTheme as useAppTheme } from '../contexts/ThemeContext'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { isAuthenticated, user, logout } = useAuth()
  const { mode, toggleTheme } = useAppTheme()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleClose()
    await logout()
    navigate('/')
  }

  // Public navigation (landing page, login, signup)
  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/login', label: 'Sign In' },
    { path: '/signup', label: 'Sign Up' }
  ]

  // Authenticated navigation
  const authNavItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/recommendations', label: 'Get Recommendations' },
    { path: '/compare', label: 'Compare' }
  ]

  const navItems = isAuthenticated ? authNavItems : publicNavItems

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? '#F8F9FA' : '#1E293B',
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'light'
          ? '0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        backgroundImage: 'none'
      }}
      elevation={0}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to={isAuthenticated ? '/dashboard' : '/'}
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: theme.palette.text.primary,
            fontWeight: 700,
            '&:hover': {
              color: theme.palette.primary.main,
            }
          }}
        >
          PC Recommender
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                bgcolor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
              }
            }}
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              variant={location.pathname === item.path ? 'contained' : 'text'}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                ...(location.pathname === item.path && {
                  bgcolor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)',
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.16)',
                  }
                }),
                ...(!location.pathname === item.path && {
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
                  }
                })
              }}
            >
              {item.label}
            </Button>
          ))}

          {isAuthenticated && (
            <>
              <Button
                onClick={handleMenu}
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
                  }
                }}
                startIcon={
                  <Avatar sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </Avatar>
                }
              >
                {!isMobile && (user?.fullName || 'User')}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem component={Link} to="/settings">
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
