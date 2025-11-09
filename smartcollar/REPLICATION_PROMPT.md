# SmartCollar IoT Application - Complete Replication Prompt

## Project Overview
Build a comprehensive IoT-based Smart Dog Collar monitoring system with real-time health tracking, behavioral analysis, and automated intervention capabilities. This is a full-stack web application for monitoring dogs' health metrics through IoT collar devices.

## Core Technology Stack
- **Frontend Framework**: React 18.2+ with Vite 5.4+
- **UI Library**: Material-UI (MUI) v5.15+
- **Routing**: React Router DOM v6.22+
- **State Management**: React Context API
- **Charts**: Recharts, Chart.js, React-Chartjs-2, Nivo Line Charts
- **Backend Integration**: Axios for REST API, Socket.io-client for WebSocket
- **Database**: Firebase (Firestore, Authentication, Storage)
- **Export**: jsPDF, html2canvas for PDF/CSV exports
- **Animations**: Framer Motion v12+
- **Date Handling**: date-fns v4.1+
- **TypeScript**: For type definitions and services

## Application Architecture

### 1. Authentication System
**Two-tier authentication with role-based access control:**

#### User Roles:
- **User Role**: Dog owners who access via Dog ID
  - Can view their specific dog's data
  - Access: Dashboard, Medical Records, Behavior Analysis, Live Heart Rate, Settings
  - Auto-creates profile if Dog ID doesn't exist

- **Admin Role**: System administrators with full access
  - Username/password authentication (default: admin/123)
  - Can manage all dog profiles
  - Access to Dog Profiles management page
  - Can add/edit/delete medical records
  - Can change password

#### Authentication Features:
- Persistent login using localStorage
- Protected routes with role-based access control
- Automatic redirect based on user type
- Session management across page refreshes

### 2. Page Structure & Functionality

#### A. Landing Page (Public)
**Purpose**: Marketing and introduction page
- Responsive navigation bar with theme toggle (dark/light mode)
- Hero section with gradient CTA button
- Key features showcase (4 feature cards):
  - Real-time Monitoring with heart rate tracking
  - AI-powered Behavior Analysis
  - Smart Alerts with ultrasonic calming
  - Cloud Analytics with trend analysis
- Mobile-responsive drawer navigation
- Footer with copyright information

#### B. Login Page (Public)
**Purpose**: Dual authentication interface
- Two-panel layout (form on left, info on right)
- Role selector dropdown (User/Admin)
- User login: Single Dog ID input field
- Admin login: Username and password fields
- Auto-profile creation for new Dog IDs
- Error handling with alert messages
- Responsive design for mobile/desktop

#### C. Dashboard (Protected - User & Admin)
**Purpose**: Main overview of dog health and status
- Welcome card displaying Dog ID
- Quick stats cards (3 cards):
  - Heart Rate with status chip (Normal/Elevated/Critical)
  - Last Vaccination date with status
  - Current Behavior with monitoring status
- Two radial gauge charts:
  - Current Stress Level (0-100%)
  - Activity Level (0-100%)
- Navigation tiles (3 tiles) linking to:
  - Medical Records
  - Behavior Analysis
  - Live Heart Rate
- Weekly Behavior Trend chart with line graph
- Recent Alerts section with color-coded chips
- "View Alerts" button for quick navigation

#### D. Medical Records (Protected - User & Admin)
**Purpose**: Vaccination and medical history management
- Vaccination records table with columns:
  - Vaccine name
  - Date administered
  - Next due date
  - Provider name
  - Status chip (Overdue/Due Soon/Up-to-date)
  - Actions column (Admin only)
- Status calculation based on due dates:
  - Overdue: Past due date (red)
  - Due Soon: Within 30 days (yellow)
  - Up-to-date: More than 30 days (green)
- Admin-only features:
  - Add new vaccination record button
  - Edit existing records (pencil icon)
  - Dialog forms for add/edit operations
- Export functionality:
  - Export to CSV with all data
  - Export to PDF with table screenshot
- Form fields: Vaccine name, Date, Next due date, Provider

#### E. Behavior Analysis (Protected - User & Admin)
**Purpose**: AI-powered behavioral insights and predictions
- Current status card showing:
  - Behavior state (Calm/Neutral/Playful/Anxious/Aggressive)
  - Current heart rate with color-coded chip
  - Confidence level radial gauge
- ML Predictive Analysis card displaying:
  - Model type: Gradient Boosting Classifier
  - Features used: HR mean/variance, HRV, steps/min, rest ratio, event count
  - Predicted state with confidence percentage
  - 1-hour risk forecast
- Historical Trends chart:
  - Line chart showing behavior over time
  - Multiple data points with dates
  - Incident count visualization
- Incident Reports section (placeholder for detailed logs)

#### F. Live Heart Rate (Protected - User & Admin)
**Purpose**: Real-time heart rate monitoring with live updates
- Current BPM display card:
  - Large numeric display (60-180 BPM range)
  - Status chip (Normal: 60-120, Elevated: 120-160, Critical: 160+)
  - Status range information
- Collar Status card showing:
  - Battery percentage
  - Connection status (Online/Offline)
  - Last data timestamp
  - GPS coordinates
  - "Trigger Calming Sound" button
- Real-time graph:
  - Live updating line chart (updates every second)
  - Simulated heart rate with random variations
  - Maintains last 60 data points
  - Alert chips below chart showing recent events
- Auto-updating every 1 second with realistic BPM fluctuations

#### G. Dog Profiles (Protected - Admin Only)
**Purpose**: Manage all dog profiles in the system
- Zone selector dropdown (for location-based filtering)
- Grid layout of dog profile cards
- Each card displays:
  - Dog ID
  - Locked status indicator
  - Delete button (for unlocked profiles, admin only)
- Add new profile button (+ card)
- Add Profile Dialog:
  - Dog ID input field
  - Validation and error messages
  - Save/Cancel actions
- Profile management:
  - Cannot delete locked profiles
  - Profiles stored in context
  - Persistent across sessions

#### H. Settings (Protected - User & Admin)
**Purpose**: User preferences and account management
- Notification Preferences card:
  - Toggle switches for:
    - Heart rate alerts
    - Behavior alerts
    - Medication reminders
  - State persists in component
- Account Management card (Admin only):
  - Change Password button
  - Password change dialog with:
    - Current password field
    - New password field
    - Confirm password field
    - Validation (min 6 characters, matching passwords)
    - Success/error alerts
    - Auto-close on success

#### I. About Page (Public)
**Purpose**: Information about the SmartCollar project

#### J. Contact Page (Public)
**Purpose**: Contact information and support

### 3. Context Providers

#### AuthContext
**Manages authentication state and user sessions**
- State: user object, loading status
- Methods:
  - `loginWithDogId(dogId)`: User authentication
  - `loginWithAdmin(username, password)`: Admin authentication
  - `changePassword(oldPassword, newPassword)`: Password update
  - `logout()`: Clear session
- Persistence: localStorage with key 'smartcollar_auth'
- User object structure:
  - User: { dogId, name, photo, type: 'user' }
  - Admin: { username, type: 'admin' }

#### ProfilesContext
**Manages dog profiles for the system**
- State: profiles array
- Methods:
  - `addProfile(id)`: Create new dog profile
  - `deleteProfile(id)`: Remove profile (if not locked)
  - `exists(id)`: Check if profile exists
- Default profiles: DOG001 (locked), DOG002 (locked)
- Persistence: localStorage with key 'smartcollar_profiles'

#### ThemeContext
**Manages light/dark mode theme**
- Toggle between light and dark themes
- Persistence across sessions
- Material-UI theme provider integration

### 4. Services Layer

#### Firebase Service (firebase.ts)
**Complete Firebase integration for data management**

Authentication Methods:
- `signIn(email, password)`: User sign-in
- `signUp(email, password)`: User registration
- `signOut()`: User logout
- `onAuthStateChanged(callback)`: Auth state listener
- `getCurrentUser()`: Get current user

Real-time Data Subscriptions:
- `subscribeToDogData(dogId, callback)`: Live sensor data updates
- `subscribeToInterventions(callback)`: Live intervention alerts
- `subscribeToDogInterventions(dogId, callback)`: Dog-specific interventions

Dog Management:
- `getDogs()`: Fetch all dogs
- `getDog(dogId)`: Fetch single dog
- `createDog(dogData)`: Create new dog profile
- `updateDog(dogId, dogData)`: Update dog information
- `deleteDog(dogId)`: Remove dog profile

File Management:
- `uploadDogPhoto(dogId, file)`: Upload dog photo to Storage
- `deleteDogPhoto(dogId, photoUrl)`: Remove dog photo

Sensor Data:
- `getSensorData(dogId, limit)`: Fetch historical sensor readings
- `createSensorData(sensorData)`: Add new sensor reading

Interventions:
- `getInterventions(dogId)`: Fetch intervention history
- `createIntervention(interventionData)`: Log new intervention
- `updateIntervention(interventionId, data)`: Update intervention status

Analytics:
- `getAggressionTrends(dogId, days)`: Calculate behavior trends over time
- Groups data by date and calculates averages

#### API Service (api.ts)
**REST API client with Axios**

Configuration:
- Base URL: '/api'
- Timeout: 10000ms
- Auto-inject auth token from localStorage
- Auto-redirect on 401 errors

Authentication Endpoints:
- POST `/auth/login`: Login with credentials
- POST `/auth/register`: Register new user

Dog Management Endpoints:
- GET `/dogs`: List all dogs (with filters)
- GET `/dogs/:id`: Get single dog
- POST `/dogs`: Create new dog
- PUT `/dogs/:id`: Update dog
- DELETE `/dogs/:id`: Delete dog

Collar Management:
- GET `/collars`: List all collars
- GET `/collars/:id`: Get collar details
- POST `/collars`: Register new collar
- PUT `/collars/:id`: Update collar

Sensor Data:
- GET `/sensor-data/:dogId`: Get sensor readings
- GET `/sensor-data/latest/:dogId`: Get latest reading
- POST `/sensor-data`: Create sensor reading

Interventions:
- GET `/interventions`: List interventions (with filters)
- POST `/interventions/:id/acknowledge`: Acknowledge alert

Analytics:
- GET `/analytics/dashboard`: Dashboard statistics
- GET `/analytics/aggression-trends/:dogId`: Behavior trends
- GET `/analytics/health-metrics/:dogId`: Health metrics

File Upload:
- POST `/dogs/:id/photo`: Upload dog photo (multipart/form-data)

Export:
- GET `/export/dog-data/:id`: Export dog data (CSV/PDF)
- GET `/export/interventions`: Export interventions (CSV/PDF)

#### WebSocket Service (websocket.ts)
**Real-time communication with Socket.io**

Connection Management:
- `connect()`: Establish WebSocket connection
- `disconnect()`: Close connection
- Auto-reconnect with exponential backoff (max 5 attempts)
- Connection URL: ws://localhost:8000

Subscription Methods:
- `subscribeToDog(dogId)`: Subscribe to dog-specific updates
- `unsubscribeFromDog(dogId)`: Unsubscribe from updates

Event Listeners:
- `onSensorUpdate(callback)`: Real-time sensor data
- `onInterventionAlert(callback)`: Intervention alerts
- `onHealthAlert(callback)`: Health warnings
- `onMessage(callback)`: General messages

Event Removal:
- `offSensorUpdate(callback)`: Remove sensor listener
- `offInterventionAlert(callback)`: Remove intervention listener
- `offHealthAlert(callback)`: Remove health listener
- `removeAllListeners()`: Clear all listeners

Utility Methods:
- `isConnected()`: Check connection status
- `getClientId()`: Get unique client identifier
- `sendMessage(type, data)`: Send custom message

### 5. TypeScript Type Definitions

#### Enums:
- `AggressionLevel`: CALM, ALERT, AGITATED, AGGRESSIVE, DANGEROUS
- `InterventionType`: LOW, MEDIUM, HIGH, CRITICAL
- `Sex`: FEMALE, MALE
- `SterilizationStatus`: NOT_STERILIZED, STERILIZED
- `BodyPosture`: RELAXED, ALERT, TENSE, AGGRESSIVE
- `TailPosition`: DOWN, NEUTRAL, UP, STIFF
- `EarPosition`: RELAXED, ALERT, FLATTENED, BACK
- `VocalizationType`: NONE, WHINING, BARKING, GROWLING, SNARLING
- `TimeOfDay`: MORNING, AFTERNOON, EVENING, NIGHT

#### Core Interfaces:
- `User`: User account information
- `Dog`: Dog profile with medical history
- `Collar`: IoT device information
- `SensorData`: Real-time sensor readings with 15+ fields
- `Intervention`: Automated intervention records

#### Form Interfaces:
- `DogFormData`: Dog creation/update form
- `CollarFormData`: Collar registration form
- `LoginFormData`: Login credentials
- `RegisterFormData`: User registration

#### Analytics Interfaces:
- `AggressionTrendData`: Behavior trends over time
- `HealthMetricsData`: Health statistics
- `DashboardAnalytics`: Dashboard summary data

#### WebSocket Message Types:
- `SensorUpdateMessage`: Real-time sensor data
- `InterventionAlertMessage`: Intervention notifications
- `HealthAlertMessage`: Health warnings

### 6. Chart Components

#### RadialGauge (RadialGauge.jsx)
- Circular progress gauge (0-100%)
- Color-coded based on value
- Center label with percentage
- Used for stress level, activity level, confidence

#### BehaviorTrendChart (BehaviorTrendChart.jsx)
- Line chart showing behavior over time
- X-axis: Dates
- Y-axis: Behavior categories
- Shows incident counts
- Recharts library

#### HeartRateChart (HeartRateChart.jsx)
- Real-time line chart
- Updates every second
- Shows last 60 data points
- X-axis: Timestamps
- Y-axis: BPM values
- Chart.js library

#### WeightTrendChart (WeightTrendChart.jsx)
- Line chart for weight tracking over time
- Recharts library

### 7. Layout Components

#### TopBar (TopBar.jsx)
- Fixed app bar at top
- Displays page title dynamically
- User profile menu with:
  - User/Admin name
  - Dog ID (for users)
  - Settings link
  - Logout button
- Theme toggle button (light/dark mode)
- Responsive design

### 8. Routing Structure

```
/ (Landing) - Public
/login - Public
/about - Public
/contact - Public

Protected Routes (User & Admin):
/dashboard - Main dashboard
/medical - Medical records
/behavior - Behavior analysis
/heartrate - Live heart rate
/settings - User settings

Protected Routes (Admin Only):
/profiles - Dog profiles management

Redirects:
/home -> /dashboard (for users)
* -> / (catch-all)
```

### 9. Data Flow & State Management

#### Local State:
- Form inputs (controlled components)
- Dialog open/close states
- Loading states
- Error messages

#### Context State:
- Authentication (user, loading)
- Profiles (profiles array)
- Theme (mode)

#### Persistent State:
- localStorage for auth token
- localStorage for profiles
- localStorage for theme preference

#### Real-time Updates:
- WebSocket for live sensor data
- Firebase listeners for data changes
- Auto-refresh timers for simulated data

### 10. Key Features Implementation

#### A. Real-time Heart Rate Monitoring
- Updates every 1 second
- Simulated BPM with random variations (±10 BPM)
- Range: 60-180 BPM
- Status calculation:
  - Normal: 60-120 BPM (green)
  - Elevated: 120-160 BPM (yellow)
  - Critical: 160+ BPM (red)
- Maintains 60-point history for chart
- Auto-scrolling chart

#### B. Medical Records Management
- CRUD operations for vaccinations
- Status calculation based on dates
- CSV export with proper formatting
- PDF export using html2canvas + jsPDF
- Admin-only edit/add capabilities
- Date picker inputs
- Validation and error handling

#### C. Behavior Analysis
- ML model information display
- Confidence percentage calculation
- Historical trend visualization
- Multiple behavior states
- Incident tracking
- Risk forecasting

#### D. Profile Management
- Add/delete dog profiles
- Locked profiles (cannot delete)
- Auto-creation on login
- Profile persistence
- Admin-only access

#### E. Theme System
- Light/dark mode toggle
- Material-UI theme integration
- Persistent preference
- Smooth transitions
- Icon changes based on mode

#### F. Export Functionality
- CSV export: Proper formatting, headers, quoted fields
- PDF export: Screenshot-based, formatted layout
- Filename with timestamp
- Blob download handling

### 11. UI/UX Requirements

#### Design System:
- Material-UI components throughout
- Consistent spacing (8px grid)
- Border radius: 3 (24px)
- Box shadows: 1-8 scale
- Responsive breakpoints: xs, sm, md, lg

#### Color Scheme:
- Primary: Purple gradient (#667eea to #764ba2)
- Success: Green (#10b981)
- Warning: Yellow/Orange (#f59e0b)
- Error: Red
- Info: Blue (#3b82f6)

#### Typography:
- Font weights: 400 (normal), 600 (semibold), 700 (bold), 800 (extrabold)
- Hierarchy: h1-h6, body1-body2, caption, subtitle
- Consistent sizing across pages

#### Spacing:
- Page padding: 2-3 units (16-24px)
- Card padding: 3 units (24px)
- Grid spacing: 2-3 units
- Stack spacing: 1-3 units

#### Responsive Design:
- Mobile-first approach
- Breakpoints: xs (0px), sm (600px), md (900px), lg (1200px)
- Collapsible navigation on mobile
- Stacked layouts on small screens
- Flexible grids

#### Interactions:
- Hover effects on cards (shadow + transform)
- Button hover states
- Loading states
- Error states with alerts
- Success feedback
- Smooth transitions

### 12. Dummy Data Structure

Create dummy data for:
- Medical records (vaccinations with dates, providers, status)
- Behavior data (current status, history with dates)
- Sensor readings (heart rate, temperature, GPS)
- Interventions (timestamps, types, success status)
- Dog profiles (names, breeds, photos)

### 13. Environment Variables

Required Firebase config:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### 14. Package Dependencies

Core:
- react, react-dom: ^18.2.0
- react-router-dom: ^6.22.0
- @mui/material: ^5.15.7
- @mui/icons-material: ^5.15.7
- @emotion/react: ^11.11.3
- @emotion/styled: ^11.11.0

Charts:
- recharts: ^2.10.4
- chart.js: ^4.4.1
- react-chartjs-2: ^5.2.0
- @nivo/line: ^0.88.0

Services:
- axios: ^1.6.7
- firebase: ^12.3.0
- socket.io-client (for WebSocket)

Utilities:
- date-fns: ^4.1.0
- jspdf: ^3.0.3
- html2canvas: ^1.4.1
- framer-motion: ^12.23.16

Dev Dependencies:
- vite: ^5.4.11
- @vitejs/plugin-react: ^4.3.4
- typescript: ^5.3.3
- eslint: ^9.33.0

### 15. File Structure

```
src/
├── assets/          # Images and static files
├── components/
│   ├── Dashboard/   # Dashboard-specific components
│   ├── charts/      # Chart components
│   ├── common/      # Shared components
│   └── layout/      # Layout components (TopBar)
├── context/         # React Context providers
│   ├── AuthContext.jsx
│   ├── ProfilesContext.jsx
│   └── ThemeContext.jsx
├── data/            # Dummy data
├── hooks/           # Custom React hooks
│   ├── useDogs.ts
│   └── useWebSocket.ts
├── pages/           # Page components
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── MedicalRecords.jsx
│   ├── BehaviorAnalysis.jsx
│   ├── LiveHeartRate.jsx
│   ├── DogProfiles.jsx
│   ├── Settings.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── routes/          # Route protection
│   └── ProtectedRoute.jsx
├── services/        # API and service layers
│   ├── firebase.ts
│   ├── api.ts
│   └── websocket.ts
├── types/           # TypeScript definitions
│   └── index.ts
├── utils/           # Utility functions
│   └── export.js
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

### 16. Critical Implementation Notes

1. **Authentication Flow**:
   - Check localStorage on app load
   - Redirect based on user type after login
   - Protect routes with ProtectedRoute component
   - Clear storage on logout

2. **Real-time Updates**:
   - Use setInterval for simulated live data
   - Clean up timers in useEffect cleanup
   - Maintain data history with array slicing

3. **Form Handling**:
   - Controlled components with useState
   - Validation before submission
   - Error state management
   - Success feedback

4. **Export Functionality**:
   - CSV: Create blob with proper MIME type
   - PDF: Use html2canvas for screenshot, then jsPDF
   - Trigger download with temporary link element

5. **Responsive Design**:
   - Use MUI's sx prop for responsive values
   - Test on mobile, tablet, desktop
   - Drawer navigation for mobile
   - Flexible grids and stacks

6. **Performance**:
   - Lazy load routes if needed
   - Memoize expensive calculations
   - Clean up listeners and timers
   - Optimize chart re-renders

7. **Error Handling**:
   - Try-catch blocks for async operations
   - User-friendly error messages
   - Fallback UI for errors
   - Console logging for debugging

## Implementation Priority

1. **Phase 1**: Setup & Authentication
   - Project setup with Vite
   - Install dependencies
   - Create contexts (Auth, Profiles, Theme)
   - Build Login page
   - Implement authentication logic
   - Create ProtectedRoute

2. **Phase 2**: Core Pages
   - Landing page
   - Dashboard with static data
   - TopBar layout component
   - Routing setup

3. **Phase 3**: Feature Pages
   - Medical Records with CRUD
   - Behavior Analysis
   - Live Heart Rate with real-time updates
   - Settings page

4. **Phase 4**: Admin Features
   - Dog Profiles management
   - Admin-specific functionality
   - Role-based access control

5. **Phase 5**: Services & Integration
   - Firebase service setup
   - API service with Axios
   - WebSocket service
   - Connect to backend (if available)

6. **Phase 6**: Charts & Visualizations
   - RadialGauge component
   - BehaviorTrendChart
   - HeartRateChart
   - WeightTrendChart

7. **Phase 7**: Polish & Export
   - Export functionality (CSV/PDF)
   - Theme refinements
   - Responsive design testing
   - Error handling improvements

## Testing Checklist

- [ ] User login with any Dog ID
- [ ] Admin login with admin/123
- [ ] Auto-profile creation on new Dog ID
- [ ] Protected route access control
- [ ] Dashboard displays all cards and charts
- [ ] Medical records CRUD (admin only)
- [ ] CSV export works
- [ ] PDF export works
- [ ] Live heart rate updates every second
- [ ] Behavior analysis displays correctly
- [ ] Dog profiles add/delete (admin only)
- [ ] Settings notification toggles
- [ ] Password change (admin only)
- [ ] Theme toggle works
- [ ] Logout clears session
- [ ] Responsive design on mobile
- [ ] Navigation works on all pages
- [ ] Persistent login after refresh

## Success Criteria

The application should:
1. Allow both user and admin authentication
2. Display real-time heart rate monitoring
3. Show comprehensive medical records
4. Provide behavior analysis with ML insights
5. Enable profile management for admins
6. Support CSV and PDF exports
7. Work seamlessly on mobile and desktop
8. Maintain state across page refreshes
9. Have smooth theme transitions
10. Handle errors gracefully

This is a complete, production-ready IoT monitoring system for smart dog collars with all features fully functional.
