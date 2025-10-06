import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Removed FontAwesome and Google sign-in as per request

// Two-pane login layout with SmartCollar explanation on the right
const Login = () => {
  const [loginType, setLoginType] = useState(0); // 0 user, 1 admin
  const [dogId, setDogId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginWithDogId, loginWithAdmin } = useAuth();
  const navigate = useNavigate();

  const handleUserLogin = async () => {
    setError('');
    const trimmedDogId = dogId.trim();
    if (!trimmedDogId) {
      setError('Please enter a valid Dog ID');
      return;
    }
    try {
      await loginWithDogId(trimmedDogId);
      navigate('/');
    } catch {
      setError('Failed to login. Try again');
    }
  };

  const handleAdminLogin = async () => {
    setError('');
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!trimmedUsername || !trimmedPassword) {
      setError('Please enter both username and password');
      return;
    }
    try {
      await loginWithAdmin(trimmedUsername, trimmedPassword);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login. Try again');
    }
  };

  const onRoleChange = (e) => {
    const val = e.target.value;
    setLoginType(val);
    setError('');
    setDogId('');
    setUsername('');
    setPassword('');
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left side: Form */}
      <Grid item xs={12} md={6} sx={{ display: 'grid', placeItems: 'center', p: { xs: 2, md: 6 } }}>
        <Card sx={{ width: '100%', maxWidth: 520, boxShadow: 8, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                SmartCollar
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Welcome Back!</Typography>
              <Typography variant="body2" color="text.secondary">Please select your role to continue.</Typography>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} variant="outlined">{error}</Alert>
            )}

            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Select your role</InputLabel>
                <Select
                  labelId="role-label"
                  label="Select your role"
                  value={loginType}
                  onChange={onRoleChange}
                >
                  <MenuItem value={0}>User</MenuItem>
                  <MenuItem value={1}>Admin</MenuItem>
                </Select>
              </FormControl>

              {loginType === 0 && (
                <Stack spacing={2}>
                  <TextField label="Dog ID" value={dogId} onChange={(e) => setDogId(e.target.value)} fullWidth helperText="Enter any Dog ID to continue" />
                  <Button variant="contained" size="large" onClick={handleUserLogin}>Continue</Button>
                </Stack>
              )}

              {loginType === 1 && (
                <Stack spacing={2}>
                  <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
                  <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
                  <Button variant="contained" size="large" onClick={handleAdminLogin}>Login</Button>
                </Stack>
              )}

              {/* Google button removed as requested */}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Right side: Project explanation */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: 'relative',
          bgcolor: '#263238',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          p: 6,
        }}
      >
        <Box sx={{ textAlign: 'left', maxWidth: 640 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            SmartCollar
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
            Intelligent IoT solution for monitoring and managing your pet’s well-being.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
            • Real-time heart rate tracking and behavioral insights.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
            • Medical records, profiles, and settings consolidated in one dashboard.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Log in as a User with your Dog ID to view your pet’s data, or log in as an
            Admin to manage profiles, devices, and system configuration.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
