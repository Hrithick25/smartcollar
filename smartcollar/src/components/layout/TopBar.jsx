import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { useColorMode } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ open, handleDrawerOpen, title = 'Dashboard', drawerWidth = 240 }) => {
  const { toggleColorMode, mode } = useColorMode();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) => theme.transitions.create(['width', 'margin']),
        ...(open && {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
        }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <IconButton color="inherit" onClick={toggleColorMode} aria-label="toggle theme">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
