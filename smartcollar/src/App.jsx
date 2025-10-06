import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Layout components (we will create minimal versions)
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

// Routes & Pages
import ProtectedRoute from '@/routes/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import MedicalRecords from '@/pages/MedicalRecords';
import BehaviorAnalysis from '@/pages/BehaviorAnalysis';
import LiveHeartRate from '@/pages/LiveHeartRate';
import Settings from '@/pages/Settings';
import DogProfiles from '@/pages/DogProfiles';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function App() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const [title, setTitle] = useState('Dashboard');

  useEffect(() => {
    const path = location.pathname.substring(1);
    setTitle(path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard');
  }, [location]);

  const isLogin = location.pathname === '/login';

  if (isLogin) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/medical" element={<MedicalRecords />} />
              <Route path="/behavior" element={<BehaviorAnalysis />} />
              <Route path="/heartrate" element={<LiveHeartRate />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profiles" element={<DogProfiles />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar
        open={open}
        handleDrawerOpen={() => setOpen(true)}
        title={title}
        drawerWidth={drawerWidth}
      />
      <Sidebar
        open={open}
        handleDrawerClose={() => setOpen(false)}
        drawerWidth={drawerWidth}
      />
      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/medical" element={<MedicalRecords />} />
              <Route path="/behavior" element={<BehaviorAnalysis />} />
              <Route path="/heartrate" element={<LiveHeartRate />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profiles" element={<DogProfiles />} />
            </Route>
          </Routes>
        </Container>
      </Main>
    </Box>
  );
}

export default App;
