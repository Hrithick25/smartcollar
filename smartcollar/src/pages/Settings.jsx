  import React, { useEffect, useState } from 'react';
  import {
    Box,
    Typography,
    Card,
    CardContent,
    FormGroup,
    FormControlLabel,
    Switch,
    TextField,
    Button,
    Stack,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
  } from '@mui/material';
  import { useAuth } from '@/context/AuthContext';
  import { useNavigate } from 'react-router-dom';
  import { useThemeContext } from '@/context/ThemeContext';

  const Settings = () => {
    const { user, changePassword } = useAuth();
    const navigate = useNavigate();
    const { mode, toggleTheme } = useThemeContext();
    const isAdmin = (typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true') || user?.type === 'admin';
    
    // Professional, logical state shape
    const [userInfo, setUserInfo] = useState(() => {
      const saved = localStorage.getItem('smartcollar_user_info');
      return saved ? JSON.parse(saved) : {
        firstName: 'Hrithick',
        lastName: '',
        email: 'hrithick2503@gmail.com',
        phone: '',
        address: ''
      };
    });
    const [petInfo, setPetInfo] = useState(() => {
      const fromSelected = (() => {
        try { return JSON.parse(localStorage.getItem('selectedProfile')) || null; } catch { return null; }
      })();
      const saved = localStorage.getItem('smartcollar_pet_info');
      const base = saved ? JSON.parse(saved) : {
        id: fromSelected?.id || 'BUD-123',
        name: fromSelected?.name || 'Buddy',
        breed: fromSelected?.breed || 'Golden Retriever',
        age: fromSelected?.age || '2 years',
        gender: fromSelected?.gender || 'Male',
        notes: ''
      };
      return base;
    });
    
    const [preferences, setPreferences] = useState(() => {
      const saved = localStorage.getItem('smartcollar_prefs');
      return saved ? JSON.parse(saved) : { darkMode: mode === 'dark', notifications: true, autoRefresh: true };
    });
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
      localStorage.setItem('smartcollar_prefs', JSON.stringify(preferences));
    }, [preferences]);

    // If admin, redirect out of Settings to Dog Profiles
    useEffect(() => {
      if (isAdmin) navigate('/dog-profiles', { replace: true });
    }, [isAdmin, navigate]);

    const handlePrefChange = (key) => (event) => {
      const value = event.target.checked;
      setPreferences((p) => ({ ...p, [key]: value }));
      if (key === 'darkMode') toggleTheme();
    };

    const handleUserInfoChange = (field) => (event) => {
      setUserInfo((a) => ({ ...a, [field]: event.target.value }));
    };
    const handlePetInfoChange = (field) => (event) => {
      setPetInfo((p) => ({ ...p, [field]: event.target.value }));
    };

    const handlePasswordInputChange = (field) => (event) => {
      setPasswordForm({
        ...passwordForm,
        [field]: event.target.value
      });
      setPasswordError('');
      setPasswordSuccess('');
    };

    const handlePasswordChange = async () => {
      const { oldPassword, newPassword, confirmPassword } = passwordForm;

      if (!oldPassword || !newPassword || !confirmPassword) {
        setPasswordError('Please fill in all fields');
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
        return;
      }

      try {
        await changePassword(oldPassword, newPassword);
        setPasswordSuccess('Password changed successfully!');
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          setOpenPasswordDialog(false);
          setPasswordSuccess('');
        }, 2000);
      } catch (error) {
        setPasswordError(error.message || 'Failed to change password');
      }
    };

    const handleClosePasswordDialog = () => {
      setOpenPasswordDialog(false);
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordError('');
      setPasswordSuccess('');
    };

    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 3 }, width: '100%' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Settings</Typography>

        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
          {/* User Information */}
          <Card sx={{ borderRadius: 3, flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>User Information</Typography>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField label="First Name" value={userInfo.firstName} onChange={handleUserInfoChange('firstName')} fullWidth />
                  <TextField label="Last Name" value={userInfo.lastName} onChange={handleUserInfoChange('lastName')} fullWidth />
                </Stack>
                <TextField label="Email" value={userInfo.email} onChange={handleUserInfoChange('email')} fullWidth />
                <TextField label="Phone" value={userInfo.phone} onChange={handleUserInfoChange('phone')} fullWidth />
                <TextField label="Address" value={userInfo.address} onChange={handleUserInfoChange('address')} fullWidth multiline minRows={2} />
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={() => {
                    const saved = localStorage.getItem('smartcollar_user_info');
                    if (saved) setUserInfo(JSON.parse(saved));
                  }}>Reset</Button>
                  <Button variant="contained" onClick={() => {
                    localStorage.setItem('smartcollar_user_info', JSON.stringify(userInfo));
                  }}>Save</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card sx={{ borderRadius: 3, flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>Preferences</Typography>
              <FormGroup>
                <FormControlLabel control={<Switch checked={preferences.darkMode} onChange={handlePrefChange('darkMode')} />} label="Dark Mode" />
                <FormControlLabel control={<Switch checked={preferences.notifications} onChange={handlePrefChange('notifications')} />} label="Notifications" />
                <FormControlLabel control={<Switch checked={preferences.autoRefresh} onChange={handlePrefChange('autoRefresh')} />} label="Auto-refresh" />
              </FormGroup>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => localStorage.setItem('smartcollar_prefs', JSON.stringify(preferences))}>Save Preferences</Button>
            </CardContent>
          </Card>
        </Stack>

        {/* Pet Information */}
        <Card sx={{ borderRadius: 3, mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>Pet Information</Typography>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Pet ID" value={petInfo.id} onChange={handlePetInfoChange('id')} fullWidth />
                <TextField label="Name" value={petInfo.name} onChange={handlePetInfoChange('name')} fullWidth />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Breed" value={petInfo.breed} onChange={handlePetInfoChange('breed')} fullWidth />
                <TextField label="Age" value={petInfo.age} onChange={handlePetInfoChange('age')} fullWidth />
                <TextField label="Gender" value={petInfo.gender} onChange={handlePetInfoChange('gender')} fullWidth />
              </Stack>
              <TextField label="Notes (allergies, conditions, etc.)" value={petInfo.notes} onChange={handlePetInfoChange('notes')} fullWidth multiline minRows={2} />
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => {
                  const saved = localStorage.getItem('smartcollar_pet_info');
                  if (saved) setPetInfo(JSON.parse(saved));
                }}>Reset</Button>
                <Button variant="contained" onClick={() => {
                  // Persist pet info
                  localStorage.setItem('smartcollar_pet_info', JSON.stringify(petInfo));
                  // Also update selected profile so Dashboard reflects changes
                  try {
                    const sel = JSON.parse(localStorage.getItem('selectedProfile') || '{}');
                    const updated = { ...sel, id: petInfo.id, name: petInfo.name, breed: petInfo.breed, age: petInfo.age, gender: petInfo.gender };
                    localStorage.setItem('selectedProfile', JSON.stringify(updated));
                  } catch {}
                }}>Save</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Change Password Dialog */}
        <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {passwordError && (
                <Alert severity="error" variant="outlined">{passwordError}</Alert>
              )}
              {passwordSuccess && (
                <Alert severity="success" variant="outlined">{passwordSuccess}</Alert>
              )}
              <TextField
                label="Current Password"
                type="password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordInputChange('oldPassword')}
                fullWidth
              />
              <TextField
                label="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange('newPassword')}
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange('confirmPassword')}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePasswordDialog}>Cancel</Button>
            <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  export default Settings;
