import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PetsIcon from '@mui/icons-material/Pets';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const Sidebar = ({ open, handleDrawerClose, drawerWidth = 240 }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.type === 'admin';
  const navigate = useNavigate();
  const location = useLocation();

  const base = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Medical Records', icon: <VaccinesIcon />, path: '/medical' },
    { label: 'Behavior Analysis', icon: <PetsIcon />, path: '/behavior' },
    { label: 'Live Heart Rate', icon: <PetsIcon />, path: '/heartrate' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];
  const adminOnly = [{ label: 'Dog Profiles', icon: <PetsIcon />, path: '/profiles' }];
  const userOnly = [{ label: 'Home', icon: <DashboardIcon />, path: '/home' }];
  const menu = (isAdmin ? [...base, ...adminOnly] : [...userOnly, ...base]);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <Typography variant="h6" component="div" sx={{ pl: 2 }}>
          SmartCollar
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.label}
            selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
