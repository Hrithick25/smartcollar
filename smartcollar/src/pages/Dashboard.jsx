import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Avatar,
  Stack,
  Divider,
  Paper,
  Fade,
  Grow
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot, deleteDoc, doc, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { 
  CalendarToday, 
  NotificationsActive, 
  Favorite, 
  TrendingUp,
  Close,
  Add,
  Event,
  Schedule,
  Restaurant,
  Delete,
  CheckCircle,
  Warning
} from '@mui/icons-material';

// Default pet profile
const defaultProfile = {
  name: 'Pet',
  type: 'Dog',
  breed: 'Unknown',
  age: 'N/A',
  gender: 'Unknown',
  image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'
};

// Modern Stat Card with Icons
const StatCard = ({ title, value, icon: Icon, color = '#6366f1', bgGradient }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        background: bgGradient || (isDark ? 'rgba(255,255,255,0.05)' : '#fff'),
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
        '&:hover': { 
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `${color}15`,
        }}
      />
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}20`, width: 48, height: 48, mr: 2 }}>
            <Icon sx={{ color: color, fontSize: 28 }} />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#fff' : 'text.primary' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Modern Appointment Card
const AppointmentCard = ({ appointment, onDelete }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Grow in>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
          background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: 'translateX(4px)',
            borderColor: '#6366f1',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <Avatar sx={{ bgcolor: '#6366f120', width: 56, height: 56 }}>
              <Event sx={{ color: '#6366f1', fontSize: 28 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: isDark ? '#fff' : 'text.primary' }}>
                {appointment.vetName}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Chip 
                  icon={<CalendarToday sx={{ fontSize: 16 }} />}
                  label={new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  size="small"
                  sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6', fontWeight: 600 }}
                />
                <Chip 
                  icon={<Schedule sx={{ fontSize: 16 }} />}
                  label={appointment.time}
                  size="small"
                  sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6', fontWeight: 600 }}
                />
              </Stack>
              {appointment.reason && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {appointment.reason}
                </Typography>
              )}
            </Box>
          </Box>
          <Tooltip title="Delete Appointment" arrow>
            <IconButton 
              size="small" 
              onClick={() => onDelete(appointment.id)}
              sx={{ 
                color: '#ef4444',
                '&:hover': { bgcolor: '#ef444410' }
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Grow>
  );
};

// Modern Reminder Card
const ReminderCard = ({ reminder, onDelete }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const dueDate = reminder?.nextDue?.toDate
    ? reminder.nextDue.toDate()
    : new Date(reminder.nextDue);

  const frequencyColors = {
    daily: '#10b981',
    'every-2-days': '#f59e0b',
    weekly: '#8b5cf6'
  };

  return (
    <Grow in>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
          background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: 'translateX(4px)',
            borderColor: frequencyColors[reminder.frequency] || '#6366f1',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <Avatar sx={{ bgcolor: `${frequencyColors[reminder.frequency] || '#6366f1'}20`, width: 56, height: 56 }}>
              <Restaurant sx={{ color: frequencyColors[reminder.frequency] || '#6366f1', fontSize: 28 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: isDark ? '#fff' : 'text.primary' }}>
                {reminder.foodType}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Chip 
                  icon={<Schedule sx={{ fontSize: 16 }} />}
                  label={reminder.time}
                  size="small"
                  sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6', fontWeight: 600 }}
                />
                <Chip 
                  label={reminder.frequency.replace('-', ' ')}
                  size="small"
                  sx={{ 
                    bgcolor: `${frequencyColors[reminder.frequency] || '#6366f1'}20`,
                    color: frequencyColors[reminder.frequency] || '#6366f1',
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }}
                />
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Next due: {isNaN(dueDate) ? 'Not set' : dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Delete Reminder" arrow>
            <IconButton 
              size="small" 
              onClick={() => onDelete(reminder.id)}
              sx={{ 
                color: '#ef4444',
                '&:hover': { bgcolor: '#ef444410' }
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Grow>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [profile, setProfile] = useState(defaultProfile);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);

  const [openApptDialog, setOpenApptDialog] = useState(false);
  const [openReminderDialog, setOpenReminderDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [apptForm, setApptForm] = useState({ vetName: '', date: '', time: '', reason: '' });
  const [reminderForm, setReminderForm] = useState({ foodType: '', time: '', frequency: 'daily' });

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const showSnack = (message, severity = 'success') =>
    setSnack({ open: true, message, severity });

  // Load profile
  useEffect(() => {
    const saved = localStorage.getItem('selectedProfile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  // Firestore listeners
useEffect(() => {
  const apptQuery = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
  const remQuery = query(collection(db, 'reminders'), orderBy('createdAt', 'desc'));

  const unsubAppt = onSnapshot(apptQuery, (snap) => {
    const apptData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setAppointments(apptData);
  });

  const unsubRem = onSnapshot(remQuery, (snap) => {
    const remData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setReminders(remData);
  });

  return () => {
    unsubAppt();
    unsubRem();
  };
}, []);



  // Submit appointment
  const handleApptSubmit = async () => {
    const userKey = user?.uid || user?.dogId;
    if (!userKey) {
      showSnack('Please sign in to book appointments', 'error');
      return;
    }
    
    const { vetName, date, time, reason } = apptForm;
    if (!vetName || !date || !time) {
      showSnack('Please fill in all required fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const dateTime = new Date(`${date}T${time}:00`);
     await addDoc(collection(db, 'appointments'), {
  vetName: vetName.trim(),
  date,
  time,
  reason: reason.trim(),
  status: 'scheduled',
  petName: profile.name,
  createdAt: serverTimestamp(),
});

      setApptForm({ vetName: '', date: '', time: '', reason: '' });
      setOpenApptDialog(false);
      showSnack('✓ Appointment booked successfully!', 'success');
    } catch (err) {
      console.error('Error booking appointment:', err);
      showSnack('Failed to book appointment. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit reminder
  const handleReminderSubmit = async () => {
    const userKey = user?.uid || user?.dogId;
    if (!userKey) {
      showSnack('Please sign in to set reminders', 'error');
      return;
    }

    const { foodType, time, frequency } = reminderForm;
    if (!foodType || !time) {
      showSnack('Please fill in all required fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const nextDue = new Date(now);
      nextDue.setHours(hours, minutes, 0, 0);
      if (nextDue <= now) nextDue.setDate(nextDue.getDate() + 1);

      await addDoc(collection(db, 'reminders'), {
  foodType: foodType.trim(),
  time,
  frequency,
  nextDue: Timestamp.fromDate(nextDue),
  petName: profile.name,
  createdAt: serverTimestamp(),
});

      
      setReminderForm({ foodType: '', time: '', frequency: 'daily' });
      setOpenReminderDialog(false);
      showSnack('✓ Food reminder set successfully!', 'success');
    } catch (err) {
      console.error('Error setting reminder:', err);
      showSnack('Failed to set reminder. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'appointments', id));
      showSnack('Appointment deleted', 'info');
    } catch (err) {
      console.error('Error deleting appointment:', err);
      showSnack('Failed to delete appointment', 'error');
    }
  };

  const deleteReminder = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'reminders', id));
      showSnack('Reminder deleted', 'info');
    } catch (err) {
      console.error('Error deleting reminder:', err);
      showSnack('Failed to delete reminder', 'error');
    }
  };

  const dogName = profile.name || 'Your Pet';
  const dogPhoto = profile.image;
  const nextAppt = appointments.length > 0 ? new Date(appointments[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: isDark 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      p: { xs: 2, md: 4 }
    }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        
        {/* Hero Section */}
        <Fade in timeout={800}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 5,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              background: isDark
                ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }}
            />
            <CardContent sx={{ p: 4, position: 'relative' }}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  {dogPhoto && (
                    <Avatar
                      src={dogPhoto}
                      alt={dogName}
                      sx={{
                        width: 100,
                        height: 100,
                        border: '4px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>
                    Welcome back, {dogName}! 🐾
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
                    {profile.breed && `${profile.breed} • `}{profile.age} {profile.gender && `• ${profile.gender}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => setOpenApptDialog(true)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      color: '#fff',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1rem',
                      border: '2px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    Book Appointment
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Fade in timeout={1000}>
              <Box>
                <StatCard
                  title="Total Appointments"
                  value={appointments.length}
                  icon={CalendarToday}
                  color="#6366f1"
                />
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Fade in timeout={1200}>
              <Box>
                <StatCard
                  title="Active Reminders"
                  value={reminders.length}
                  icon={NotificationsActive}
                  color="#10b981"
                />
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Fade in timeout={1400}>
              <Box>
                <StatCard
                  title="Next Appointment"
                  value={nextAppt}
                  icon={Event}
                  color="#f59e0b"
                />
              </Box>
            </Fade>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Appointments Section */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#6366f120', width: 48, height: 48 }}>
                      <CalendarToday sx={{ color: '#6366f1' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#fff' : 'text.primary' }}>
                        Appointments
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {appointments.length} scheduled
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setOpenApptDialog(true)}
                    sx={{
                      borderRadius: 2,
                      borderColor: '#6366f1',
                      color: '#6366f1',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#6366f1',
                        bgcolor: '#6366f110',
                      },
                    }}
                  >
                    Add New
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ maxHeight: 500, overflowY: 'auto', pr: 1 }}>
                  {appointments.length ? (
                    appointments.map((a) => (
                      <AppointmentCard key={a.id} appointment={a} onDelete={deleteAppointment} />
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Event sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                        No appointments yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Book your first vet appointment
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Reminders Section */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#10b98120', width: 48, height: 48 }}>
                      <Restaurant sx={{ color: '#10b981' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#fff' : 'text.primary' }}>
                        Food Reminders
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {reminders.length} active
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setOpenReminderDialog(true)}
                    sx={{
                      borderRadius: 2,
                      borderColor: '#10b981',
                      color: '#10b981',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#10b981',
                        bgcolor: '#10b98110',
                      },
                    }}
                  >
                    Add New
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ maxHeight: 500, overflowY: 'auto', pr: 1 }}>
                  {reminders.length ? (
                    reminders.map((r) => (
                      <ReminderCard key={r.id} reminder={r} onDelete={deleteReminder} />
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Restaurant sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                        No reminders set
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Create a feeding schedule
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Appointment Dialog */}
       {/* Appointment Dialog */}
<Dialog
  open={openApptDialog}
  onClose={() => !submitting && setOpenApptDialog(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      background: isDark ? '#1e293b' : '#fff',
    },
  }}
>
  <DialogTitle sx={{ pb: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: '#6366f120' }}>
        <Event sx={{ color: '#6366f1' }} />
      </Avatar>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Book Appointment
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Enter details below
        </Typography>
      </Box>
    </Box>
  </DialogTitle>

  <DialogContent sx={{ pt: 3 }}>
    <Stack spacing={3}>
      <TextField
        label="Vet or Clinic Name"
        fullWidth
        value={apptForm.vetName}
        onChange={(e) => setApptForm({ ...apptForm, vetName: e.target.value })}
        disabled={submitting}
      />
      <TextField
        label="Appointment Date (any format)"
        fullWidth
        value={apptForm.date}
        onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
        disabled={submitting}
      />
      <TextField
        label="Appointment Time (any format)"
        fullWidth
        value={apptForm.time}
        onChange={(e) => setApptForm({ ...apptForm, time: e.target.value })}
        disabled={submitting}
      />
      <TextField
        label="Reason"
        fullWidth
        multiline
        rows={3}
        value={apptForm.reason}
        onChange={(e) => setApptForm({ ...apptForm, reason: e.target.value })}
        disabled={submitting}
        placeholder="Example: Checkup, Vaccination, etc."
      />
    </Stack>
  </DialogContent>

  <DialogActions sx={{ p: 3, pt: 2 }}>
    <Button
      onClick={() => setOpenApptDialog(false)}
      disabled={submitting}
      sx={{ borderRadius: 2 }}
    >
      Cancel
    </Button>
    <Button
      onClick={async () => {
        const userKey = user?.uid || user?.dogId;
        if (!userKey) return showSnack('Sign in first!', 'error');

        try {
          await addDoc(collection(db, 'users', userKey, 'appointments'), {
            vetName: apptForm.vetName || '',
            date: apptForm.date || '',
            time: apptForm.time || '',
            reason: apptForm.reason || '',
            createdAt: serverTimestamp(),
          });
          setApptForm({ vetName: '', date: '', time: '', reason: '' });
          setOpenApptDialog(false);
          showSnack('Appointment saved to Firestore!', 'success');
        } catch (err) {
          console.error(err);
          showSnack('Failed to save appointment.', 'error');
        }
      }}
      variant="contained"
      disabled={submitting}
      sx={{
        borderRadius: 2,
        px: 4,
        bgcolor: '#6366f1',
        '&:hover': { bgcolor: '#4f46e5' },
      }}
    >
      Book Appointment
    </Button>
  </DialogActions>
</Dialog>

       {/* Reminder Dialog */}
<Dialog
  open={openReminderDialog}
  onClose={() => !submitting && setOpenReminderDialog(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      background: isDark ? '#1e293b' : '#fff',
    },
  }}
>
  <DialogTitle sx={{ pb: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: '#10b98120' }}>
        <Restaurant sx={{ color: '#10b981' }} />
      </Avatar>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Set Reminder
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Add reminder details
        </Typography>
      </Box>
    </Box>
  </DialogTitle>

  <DialogContent sx={{ pt: 3 }}>
    <Stack spacing={3}>
      <TextField
        label="Reminder Type"
        fullWidth
        value={reminderForm.foodType}
        onChange={(e) =>
          setReminderForm({ ...reminderForm, foodType: e.target.value })
        }
        disabled={submitting}
        placeholder="Example: Feed Pedigree / Walk / Medicine"
      />
      <TextField
        label="Reminder Time or Description"
        fullWidth
        value={reminderForm.time}
        onChange={(e) =>
          setReminderForm({ ...reminderForm, time: e.target.value })
        }
        disabled={submitting}
      />
      <TextField
        label="Frequency (any text)"
        fullWidth
        value={reminderForm.frequency}
        onChange={(e) =>
          setReminderForm({ ...reminderForm, frequency: e.target.value })
        }
        disabled={submitting}
 placeholder="e.g., Daily, Every Morning, Once a Week"
      />
    </Stack>
  </DialogContent>

  <DialogActions sx={{ p: 3, pt: 2 }}>
    <Button
      onClick={() => setOpenReminderDialog(false)}
      disabled={submitting}
      sx={{ borderRadius: 2 }}
    >
      Cancel
    </Button>
    <Button
      onClick={async () => {
        try {
          const newRem = {
            foodType: reminderForm.foodType.trim(),
            time: reminderForm.time.trim(),
            frequency: reminderForm.frequency.trim(),
            createdAt: new Date().toISOString(),
          };

          // Save to Firestore root (no login needed)
          await addDoc(collection(db, 'reminders'), {
            ...newRem,
            createdAt: serverTimestamp(),
          });

          // Instantly display on dashboard
          setReminders((prev) => [{ id: Date.now().toString(), ...newRem }, ...prev]);

          setReminderForm({ foodType: '', time: '', frequency: 'daily' });
          setOpenReminderDialog(false);
          showSnack('✓ Reminder added successfully!', 'success');
        } catch (err) {
          console.error('Error adding reminder:', err);
          showSnack('Failed to add reminder.', 'error');
        }
      }}
      variant="contained"
      disabled={submitting}
      sx={{
        borderRadius: 2,
        px: 4,
        bgcolor: '#10b981',
        '&:hover': { bgcolor: '#059669' },
      }}
    >
      Set Reminder
    </Button>
  </DialogActions>
</Dialog>

{/* Snackbar */}
<Snackbar
  open={snack.open}
  autoHideDuration={4000}
  onClose={() => setSnack({ ...snack, open: false })}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert
    onClose={() => setSnack({ ...snack, open: false })}
    severity={snack.severity}
    variant="filled"
    sx={{
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      fontWeight: 600,
    }}
  >
    {snack.message}
  </Alert>
</Snackbar>
</Box>
</Box>
);
};

export default Dashboard;
