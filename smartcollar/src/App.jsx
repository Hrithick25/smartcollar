import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';

// Layout components
import TopBar from './components/layout/TopBar';

// Routes & Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import MedicalRecords from '@/pages/MedicalRecords';
import BehaviorAnalysis from '@/pages/BehaviorAnalysis';
import LiveHeartRate from '@/pages/LiveHeartRate';
import Settings from '@/pages/Settings';
import DogProfiles from '@/pages/DogProfiles';
import Landing from '@/pages/Landing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import ManageProfiles from '@/pages/ManageProfiles';

function App() {
  const location = useLocation();
  const [title, setTitle] = useState('Dashboard');

  useEffect(() => {
    const path = location.pathname.substring(1);
    const pretty = (p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : 'Dashboard');
    if (location.pathname === '/') setTitle('Welcome');
    else if (location.pathname === '/about') setTitle('About');
    else if (location.pathname === '/contact') setTitle('Contact');
    else if (location.pathname === '/dashboard') setTitle('Dashboard');
    else if (location.pathname === '/medical') setTitle('Medical');
    else if (location.pathname === '/behavior') setTitle('Behavior');
    else if (location.pathname === '/dog-profiles') setTitle('Dog Profiles');
    else setTitle(pretty(path));
  }, [location]);

  // Show TopBar on all routes except login and landing
  const showTopBar = location.pathname !== '/login' && location.pathname !== '/';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      <CssBaseline />
      {showTopBar && <TopBar title={title} />}
      
      <Box sx={{ 
        flex: 1,
        pt: showTopBar ? 8 : 0,
        width: '100%',
        height: '100vh',
        overflow: 'auto'
      }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Main App Layout */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medical" element={<MedicalRecords />} />
            <Route path="/behavior" element={<BehaviorAnalysis />} />
            <Route path="/heartrate" element={<LiveHeartRate />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Admin Routes */}
            <Route path="/manage-profiles" element={<ManageProfiles />} />
            <Route path="/dog-profiles" element={<DogProfiles />} />
            
            {/* Redirects */}
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
      </Box>
    </Box>
  );
}

export default App;
