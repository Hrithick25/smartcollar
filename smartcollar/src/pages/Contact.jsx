import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
  Button,
  TextField
} from '@mui/material';
import {
  Email,
  Phone,
  Person,
  Business,
  Copyright
} from '@mui/icons-material';

const Contact = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>

      {/* Main Content */}
      <Box sx={{ flex: 1, pt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 }, py: { xs: 4, md: 8 } }}>
          <Stack spacing={8} alignItems="center" sx={{ width: '100%' }}>
            <Typography variant="h2" sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
              Get In Touch
            </Typography>

            <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Person color="primary" sx={{ fontSize: 48, mb: 2 }}/>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Developer</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Hrithick Ram</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Full Stack Developer & IoT Specialist
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Email color="primary" sx={{ fontSize: 48, mb: 2 }}/>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Email Us</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>hrithick2503@gmail.com</Typography>
                    <Typography variant="body2" color="text.secondary">
                      For technical support and inquiries
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Phone color="primary" sx={{ fontSize: 48, mb: 2 }}/>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Call Us</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>+91 9025947783</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mon-Fri 9AM-6PM IST
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Contact Form */}
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: { xs: 3, md: 4 }, width: '100%', maxWidth: 900 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                Send us a message
              </Typography>
              <Stack spacing={3} component="form">
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter your full name"
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  placeholder="Enter your email address"
                />
                <TextField
                  label="Subject"
                  variant="outlined"
                  fullWidth
                  placeholder="What's this about?"
                />
                <TextField
                  label="Message"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Tell us how we can help you..."
                />
                <Button
                  variant="contained"
                  size="large"
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  Send Message
                </Button>
              </Stack>
            </Card>

            {/* Additional Information */}
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: { xs: 3, md: 4 }, width: '100%', maxWidth: 900 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: 'primary.main' }}>
                Project Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Project:</strong> SmartCollar - IoT Pet Health Monitoring
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Technology:</strong> React, Node.js, IoT Sensors, ML
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Focus:</strong> Heart Rate Analysis & Behavioral Monitoring
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Target:</strong> Pet Parents & Veterinarians
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Features:</strong> Real-time Monitoring, AI Alerts, Cloud Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Goal:</strong> Early Detection of Health & Behavioral Issues
                  </Typography>
                </Grid>
              </Grid>
            </Card>
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

export default Contact;
