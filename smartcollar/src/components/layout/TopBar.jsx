import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip, Button } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useColorMode } from '@/context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = ({ title = 'Dashboard' }) => {
  const { toggleColorMode, mode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 2,
      }}
    >
      <Toolbar sx={{ px: { xs: 1, md: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flexGrow: 1 }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>

        {/* Top navigation (hidden on About, Contact & Manage Profiles pages) */}
        {location.pathname !== '/about' && location.pathname !== '/contact' && location.pathname !== '/manage-profiles' && (
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1,
            mx: 'auto',
            px: 2
          }}>
            <Button color="inherit" onClick={() => navigate('/dashboard')} disabled={location.pathname === '/dashboard'}>Dashboard</Button>
            <Button color="inherit" onClick={() => navigate('/medical')} disabled={location.pathname.startsWith('/medical')}>Medical</Button>
            <Button color="inherit" onClick={() => navigate('/behavior')} disabled={location.pathname.startsWith('/behavior')}>Behavior</Button>
            <Button color="inherit" onClick={() => navigate('/heartrate')} disabled={location.pathname.startsWith('/heartrate')}>Live Heart Rate</Button>
            {isAdmin ? (
              <Button color="inherit" onClick={() => navigate('/dog-profiles')} disabled={location.pathname.startsWith('/dog-profiles')}>Dog Profiles</Button>
            ) : (
              <Button color="inherit" onClick={() => navigate('/settings')} disabled={location.pathname.startsWith('/settings')}>Settings</Button>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <IconButton color="inherit" onClick={toggleColorMode} aria-label="toggle theme">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Exit">
            <IconButton color="inherit" onClick={() => { try { window.close(); } catch (e) {} finally { navigate('/login'); } }} aria-label="exit">
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
