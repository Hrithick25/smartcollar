import React, { useState } from 'react';
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

const Settings = () => {
  const { user, changePassword } = useAuth();
  const isAdmin = user?.type === 'admin';
  const [notifications, setNotifications] = useState({
    heartRate: true,
    behavior: false,
    medication: false
  });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleNotificationChange = (type) => (event) => {
    setNotifications({
      ...notifications,
      [type]: event.target.checked
    });
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
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Settings</Typography>

      <Stack spacing={2}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Notification Preferences</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={notifications.heartRate} onChange={handleNotificationChange('heartRate')} />}
                label="Heart rate alerts"
              />
              <FormControlLabel
                control={<Switch checked={notifications.behavior} onChange={handleNotificationChange('behavior')} />}
                label="Behavior alerts"
              />
              <FormControlLabel
                control={<Switch checked={notifications.medication} onChange={handleNotificationChange('medication')} />}
                label="Medication reminders"
              />
            </FormGroup>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Account Management</Typography>
              <Button
                variant="outlined"
                onClick={() => setOpenPasswordDialog(true)}
                fullWidth
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        )}
      </Stack>

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
