import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Security,
  Timeline,
  Analytics,
  Pets,
  Copyright
} from '@mui/icons-material';

const About = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>

      {/* Main Content */}
      <Box sx={{ flex: 1, pt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md" sx={{ px: { xs: 3, md: 4 }, py: { xs: 4, md: 8 } }}>
          <Stack spacing={8} alignItems="center" sx={{ width: '100%' }}>
            <Typography variant="h2" sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
              About SmartCollar
            </Typography>

            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Stack spacing={4}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Project Overview
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                    SmartCollar is an innovative IoT solution designed specifically for pet parents who want to stay connected
                    with their furry companions. Our smart collar combines advanced sensors with intelligent AI to provide
                    comprehensive health monitoring and behavioral insights.
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                    Whether you're at home or away, SmartCollar keeps you informed about your dog's heart rate, activity levels,
                    and behavioral patterns. Early detection of health issues and understanding behavioral changes has never been easier.
                  </Typography>

                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mt: 4 }}>
                    Our Solution
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                    We provide a complete ecosystem that includes the smart collar hardware, mobile application, and cloud-based
                    analytics platform. The system learns your dog's normal behavior patterns and alerts you to any deviations
                    that might indicate health concerns or stress.
                  </Typography>

                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mt: 4 }}>
                    Technical Architecture
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                    Built with React for the frontend, Node.js for the backend, and integrated with IoT sensors for real-time data
                    collection. Our machine learning algorithms analyze heart rate patterns to detect stress, anxiety, and potential
                    health issues before they become serious problems.
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Card sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' }
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Security color="primary" sx={{ fontSize: 48, mb: 2 }}/>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Secure & Private</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your pet's data is encrypted and stored securely with privacy as our top priority.
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' }
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Timeline color="secondary" sx={{ fontSize: 48, mb: 2 }}/>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Real-time Monitoring</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get instant notifications and live updates about your dog's vital signs and activity.
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' }
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Analytics color="success" sx={{ fontSize: 48, mb: 2 }}/>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>AI-Powered Insights</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Machine learning algorithms analyze patterns to provide actionable health recommendations.
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' }
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Pets color="warning" sx={{ fontSize: 48, mb: 2 }}/>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Pet-Friendly Design</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lightweight, comfortable collar designed for all-day wear with long-lasting battery life.
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>

            {/* System Overview Card */}
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: { xs: 3, md: 4 }, width: '100%' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'primary.main', textAlign: 'center' }}>
                System Overview
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Heart Rate Detection & Analysis
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
                The proposed system uses heart rate elevation as a primary indicator of stress or potential aggressive behavior in dogs.
                When elevated heart rate crosses predetermined thresholds, the collar emits ultrasonic calming sounds and visual LED
                alerts while transmitting data to a cloud-based React application with ML analysis capabilities.
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Normal vs Elevated Heart Rate Ranges
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Normal dog heart rate ranges vary by size: small/toy breeds (100-140 bpm), medium/large breeds (70-120 bpm),
                and puppies (120-160 bpm). Research indicates aggressive dogs have lower heart rate variability and elevated
                baseline rates. Studies show that sniffer dogs exhibit heart rate increases when encountering positive samples,
                validating heart rate as a behavioral indication.
              </Typography>
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

export default About;
