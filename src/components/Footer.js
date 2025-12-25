import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'

const Footer = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Components', href: '/components' },
      { label: 'Recommendations', href: '/recommendations' }
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Community', href: '/community' },
      { label: 'Contact Support', href: '/support' }
    ]
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        py: { xs: 4, md: 6 },
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="div" sx={{ mb: 2, color: 'white' }}>
              PC Recommender
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, maxWidth: 300 }}>
              Intelligent PC recommendations powered by AI to help you find the perfect computer setup for your needs and budget.
            </Typography>
          </Grid>

          {/* Product Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
              Product
            </Typography>
            {footerLinks.product.map((link) => (
              <Box key={link.label} sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to={link.href}
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    fontSize: '0.9rem'
                  }}
                >
                  {link.label}
                </MuiLink>
              </Box>
            ))}
          </Grid>

          {/* Company Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
              Company
            </Typography>
            {footerLinks.company.map((link) => (
              <Box key={link.label} sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to={link.href}
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    fontSize: '0.9rem'
                  }}
                >
                  {link.label}
                </MuiLink>
              </Box>
            ))}
          </Grid>

          {/* Support Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
              Support
            </Typography>
            {footerLinks.support.map((link) => (
              <Box key={link.label} sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to={link.href}
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    fontSize: '0.9rem'
                  }}
                >
                  {link.label}
                </MuiLink>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'center' },
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            © {currentYear} PC Recommender. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink
              href="#"
              color="inherit"
              sx={{ fontSize: '0.8rem', textDecoration: 'none' }}
            >
              Privacy
            </MuiLink>
            <MuiLink
              href="#"
              color="inherit"
              sx={{ fontSize: '0.8rem', textDecoration: 'none' }}
            >
              Terms
            </MuiLink>
            <MuiLink
              href="#"
              color="inherit"
              sx={{ fontSize: '0.8rem', textDecoration: 'none' }}
            >
              Cookies
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

