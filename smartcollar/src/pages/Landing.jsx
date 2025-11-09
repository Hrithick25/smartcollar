import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Email,
  Phone,
  Favorite,
  Timeline,
  Security,
  Analytics,
  Pets,
  Copyright,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '@/context/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleTheme } = useThemeContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Pets sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            SmartCollar
          </Typography>
        </Stack>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/about')}>
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/contact')}>
            <ListItemText primary="Contact" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      {/* Navigation */}
      <AppBar position="fixed" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 2 }}>
        <Toolbar sx={{ px: { xs: 1, md: 2 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
            <Pets sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              SmartCollar
            </Typography>
          </Stack>

          {/* Desktop Navigation */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Button color="inherit" onClick={() => navigate('/about')}>About</Button>
            <Button color="inherit" onClick={() => navigate('/contact')}>Contact</Button>
            <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
          </Stack>

          {/* Mobile Navigation */}
          <Stack direction="row" spacing={1} sx={{ display: { md: 'none' } }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 8, md: 12 },
          bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f5f7fa',
          minHeight: '80vh',
          width: '100%'
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
          <Stack spacing={6} alignItems="center" sx={{ textAlign: 'center', width: '100%' }}>
            <Stack spacing={3} alignItems="center">
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.8rem', lg: '3.2rem' },
                  color: 'text.primary',
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                Advanced Canine Health Monitoring with SmartCollar
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  maxWidth: 700,
                  lineHeight: 1.7,
                  fontWeight: 400,
                  textAlign: 'center'
                }}
              >
                Monitor, control and automate your dog's health monitoring in real-time using IoT sensors and AI-powered behavioral analysis.
              </Typography>
              <Button
                size="large"
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: 3,
                  '&:hover': { boxShadow: 6, background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)' }
                }}
              >
                Get Started
              </Button>
            </Stack>

          </Stack>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper', width: '100%' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
          <Stack spacing={6} alignItems="center" sx={{ width: '100%' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', color: 'text.primary' }}>
              Key Features
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 1,
                  bgcolor: 'background.paper',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Favorite sx={{ fontSize: 48, color: '#10b981', mb: 2 }}/>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Real-time Monitoring</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Live heart rate tracking with instant alerts for abnormal patterns and stress indicators
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 1,
                  bgcolor: 'background.paper',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Analytics sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }}/>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Behavior Analysis</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      AI-powered insights into behavioral patterns and mood analysis using ML algorithms
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 1,
                  bgcolor: 'background.paper',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Security sx={{ fontSize: 48, color: '#3b82f6', mb: 2 }}/>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Smart Alerts</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Ultrasonic calming sounds and LED alerts when elevated heart rate is detected
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 1,
                  bgcolor: 'background.paper',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Timeline sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }}/>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Cloud Analytics</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Cloud-based data storage with comprehensive health history and trend analysis
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{
        bgcolor: 'primary.dark',
        py: 3,
        width: '100%',
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Copyright sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant="body2" color="white">
            2025 SmartCollar. All rights reserved.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};
  
export default Landing;