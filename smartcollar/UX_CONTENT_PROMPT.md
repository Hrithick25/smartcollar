# SmartCollar - UX & Content Structure Prompt

Build a complete IoT pet health monitoring web application with the following UX flow, content structure, and functionality. **Do not follow any specific UI design** - create your own modern, clean interface using any design system or styling approach you prefer.

---

## 1. LANDING PAGE (Public - Home)

### Navigation Bar
- Logo/Brand: "SmartCollar"
- Navigation Links: Home, About, Contact
- Theme Toggle: Light/Dark mode switcher
- Login Button: Prominent call-to-action
- Mobile: Collapsible hamburger menu

### Hero Section
**Headline:** "SmartCollar"

**Subheadline:** "Track vitals, understand behavior, and keep pets safer with a real-time connected collar and a clean dashboard."

**Feature Tags/Badges:**
- Live HR & HRV
- Behavior Signals
- Cloud Storage
- ML Insights

**Call-to-Action Buttons:**
- Primary: "How it works" (scrolls to features)
- Secondary: "Overview" (scrolls to specs)

### How It Works Section (3 Feature Cards)

**Card 1: Live Telemetry**
- Icon: Heart/Pulse
- Title: "Live Telemetry"
- Description: "Heart rate and motion signals are streamed continuously to establish a personal baseline."

**Card 2: Sync to Cloud**
- Icon: Cloud
- Title: "Sync to Cloud"
- Description: "Data is stored securely for history, comparisons, and device fleet management."

**Card 3: ML Insights**
- Icon: Analytics/Chart
- Title: "ML Insights"
- Description: "Models flag stress patterns and predict short-term risk to support early action."

### Project Overview Section

**Title:** "Project Overview"

**Technical Details (3 columns):**
- **Device:** ESP32-based collar with HR sensing
- **Cloud:** Secure storage and aggregation for analytics
- **Dashboard:** React + MUI with role-based access control

**Key Stats (3 items):**
- **24/7** - Monitoring
- **ML** - Predictive
- **Secure** - Cloud

### Footer
- Copyright: "© 2025 SmartCollar. All rights reserved."

---

## 2. ABOUT PAGE (Public)

### Navigation Bar
- Back button to home
- Logo/Brand: "SmartCollar"
- Login Button

### Main Content

**Page Title:** "About SmartCollar"

**Section 1: Project Overview**
SmartCollar is an innovative IoT solution designed specifically for pet parents who want to stay connected with their furry companions. Our smart collar combines advanced sensors with intelligent AI to provide comprehensive health monitoring and behavioral insights.

Whether you're at home or away, SmartCollar keeps you informed about your dog's heart rate, activity levels, and behavioral patterns. Early detection of health issues and understanding behavioral changes has never been easier.

**Section 2: Our Solution**
We provide a complete ecosystem that includes the smart collar hardware, mobile application, and cloud-based analytics platform. The system learns your dog's normal behavior patterns and alerts you to any deviations that might indicate health concerns or stress.

**Section 3: Technical Architecture**
Built with React for the frontend, Node.js for the backend, and integrated with IoT sensors for real-time data collection. Our machine learning algorithms analyze heart rate patterns to detect stress, anxiety, and potential health issues before they become serious problems.

### Feature Cards (4 cards)

**Card 1: Secure & Private**
- Icon: Shield/Security
- Title: "Secure & Private"
- Description: "Your pet's data is encrypted and stored securely with privacy as our top priority."

**Card 2: Real-time Monitoring**
- Icon: Timeline/Graph
- Title: "Real-time Monitoring"
- Description: "Get instant notifications and live updates about your dog's vital signs and activity."

**Card 3: AI-Powered Insights**
- Icon: Analytics/Brain
- Title: "AI-Powered Insights"
- Description: "Machine learning algorithms analyze patterns to provide actionable health recommendations."

**Card 4: Pet-Friendly Design**
- Icon: Paw/Pet
- Title: "Pet-Friendly Design"
- Description: "Lightweight, comfortable collar designed for all-day wear with long-lasting battery life."

### System Overview Card

**Title:** "System Overview"

**Subsection 1: Heart Rate Detection & Analysis**
The proposed system uses heart rate elevation as a primary indicator of stress or potential aggressive behavior in dogs. When elevated heart rate crosses predetermined thresholds, the collar emits ultrasonic calming sounds and visual LED alerts while transmitting data to a cloud-based React application with ML analysis capabilities.

**Subsection 2: Normal vs Elevated Heart Rate Ranges**
Normal dog heart rate ranges vary by size: small/toy breeds (100-140 bpm), medium/large breeds (70-120 bpm), and puppies (120-160 bpm). Research indicates aggressive dogs have lower heart rate variability and elevated baseline rates. Studies show that sniffer dogs exhibit heart rate increases when encountering positive samples, validating heart rate as a behavioral indication.

### Footer
- Copyright: "© 2025 SmartCollar. All rights reserved."

---

## 3. CONTACT PAGE (Public)

### Navigation Bar
- Back button to home
- Title: "Contact Us"
- Login Button

### Main Content

**Page Title:** "Get In Touch"

### Contact Information Cards (3 cards)

**Card 1: Developer**
- Icon: Person
- Title: "Developer"
- Name: "Hrithick Ram"
- Subtitle: "Full Stack Developer & IoT Specialist"

**Card 2: Email**
- Icon: Email
- Title: "Email Us"
- Email: "hrithick2503@gmail.com"
- Subtitle: "For technical support and inquiries"

**Card 3: Phone**
- Icon: Phone
- Title: "Call Us"
- Phone: "+91 9025947783"
- Subtitle: "Mon-Fri 9AM-6PM IST"

### Contact Form

**Title:** "Send us a message"

**Form Fields:**
- Name (text input) - "Enter your full name"
- Email (email input) - "Enter your email address"
- Subject (text input) - "What's this about?"
- Message (textarea, 4 rows) - "Tell us how we can help you..."
- Submit Button: "Send Message"

### Project Information Card

**Title:** "Project Information"

**Left Column:**
- **Project:** SmartCollar - IoT Pet Health Monitoring
- **Technology:** React, Node.js, IoT Sensors, ML
- **Focus:** Heart Rate Analysis & Behavioral Monitoring

**Right Column:**
- **Target:** Pet Parents & Veterinarians
- **Features:** Real-time Monitoring, AI Alerts, Cloud Analytics
- **Goal:** Early Detection of Health & Behavioral Issues

### Footer
- Copyright: "© 2025 SmartCollar. All rights reserved."

---

## 4. LOGIN PAGE (Public)

### Layout
Two-panel layout (split screen on desktop, stacked on mobile)

### Left Panel: Login Form

**Title:** "SmartCollar"

**Subtitle:** "Welcome Back!"

**Description:** "Please select your role to continue."

**Role Selector Dropdown:**
- Options: "User" or "Admin"

#### User Login Mode (when "User" selected)
**Form Fields:**
- Dog ID (text input) - "Enter any Dog ID to continue"
- Helper text: "Enter any Dog ID to continue"
- Submit Button: "Continue"

**Behavior:**
- Accept any Dog ID
- Auto-create profile if Dog ID doesn't exist
- Redirect to /dashboard after login

#### Admin Login Mode (when "Admin" selected)
**Form Fields:**
- Username (text input)
- Password (password input)
- Submit Button: "Login"

**Credentials:**
- Username: admin
- Password: 123

**Behavior:**
- Validate credentials
- Show error if invalid
- Redirect to /dashboard after login

**Error Handling:**
- Display error alerts for invalid inputs
- Clear errors when switching modes

### Right Panel: Project Information

**Title:** "SmartCollar"

**Subtitle:** "Intelligent IoT solution for monitoring and managing your pet's well-being."

**Features List:**
- Real-time heart rate tracking and behavioral insights.
- Medical records, profiles, and settings consolidated in one dashboard.
- Log in as a User with your Dog ID to view your pet's data, or log in as an Admin to manage profiles, devices, and system configuration.

---

## 5. AUTHENTICATION & ROUTING

### User Roles

**User Role:**
- Login: Dog ID only
- Access: Dashboard, Medical Records, Behavior Analysis, Live Heart Rate, Settings
- Cannot: Manage profiles, edit medical records

**Admin Role:**
- Login: Username + Password
- Access: All pages including Dog Profiles management
- Can: Add/edit/delete medical records, manage dog profiles, change password

### Protected Routes
- All pages except Landing, About, Contact, Login require authentication
- Role-based access control for admin-only pages
- Auto-redirect to login if not authenticated
- Persistent sessions using localStorage

---

## 6. DASHBOARD (Protected - User & Admin)

### Top Bar
- Page title: "Dashboard"
- User profile menu with logout option
- Theme toggle

### Welcome Card
- Display: "Dog ID: [user's dog ID]"
- Button: "View Alerts" (scrolls to alerts section)

### Quick Stats (3 cards)

**Card 1: Heart Rate**
- Value: "145 BPM"
- Status: "Elevated" (color-coded chip)

**Card 2: Last Vaccination**
- Value: "Aug 10, 2025"
- Status: "Up-to-date"

**Card 3: Behavior**
- Value: "Anxious"
- Status: "Monitoring"

### Gauge Charts (2 circular gauges)

**Gauge 1: Current Stress Level**
- Value: 68%
- Label: "Stress"

**Gauge 2: Activity Level**
- Value: 54%
- Label: "Activity"

### Navigation Tiles (3 clickable cards)

**Tile 1: Medical Records**
- Title: "Medical Records"
- Description: "Vaccinations, history, meds"
- Links to: /medical

**Tile 2: Behavior Analysis**
- Title: "Behavior Analysis"
- Description: "AI insights and trends"
- Links to: /behavior

**Tile 3: Live Heart Rate**
- Title: "Live Heart Rate"
- Description: "Real-time monitoring"
- Links to: /heartrate

### Weekly Behavior Trend Chart
- Title: "Weekly Behavior Trend"
- Line chart showing behavior over past 5 days
- Data points: Calm, Neutral, Playful, Anxious with incident counts

### Recent Alerts Section
- Title: "Recent Alerts"
- Alert chips with timestamps:
  - "3:02 PM • Elevated heart rate detected" (warning)
  - "2:45 PM • Ultrasonic calming activated" (error)
  - "1:10 PM • Routine check completed" (info)

---

## 7. MEDICAL RECORDS (Protected - User & Admin)

### Page Header
- Title: "Medical Records"
- Buttons:
  - "Add Record" (Admin only)
  - "Export CSV"
  - "Export PDF"

### Vaccination Records Table

**Columns:**
- Vaccine name
- Date administered
- Next due date
- Provider name
- Status (color-coded chip)
- Actions (Admin only - edit icon)

**Status Logic:**
- **Overdue** (red): Past due date
- **Due Soon** (yellow): Within 30 days
- **Up-to-date** (green): More than 30 days away

**Sample Data:**
- Rabies, Aug 10, 2024, Aug 10, 2025, City Vet Clinic
- DHPP, Jul 15, 2024, Jul 15, 2025, City Vet Clinic
- Bordetella, Sep 5, 2024, Sep 5, 2025, City Vet Clinic

### Add/Edit Record Dialog (Admin only)

**Form Fields:**
- Vaccine Name (text input)
- Date (date picker)
- Next Due Date (date picker)
- Provider (text input)
- Actions: Cancel, Save/Update

**Behavior:**
- Validate all fields required
- Update table on save
- Close dialog on success

### Export Functionality
- **CSV Export:** Download table data as CSV file
- **PDF Export:** Download table as PDF document
- Filename includes timestamp

---

## 8. BEHAVIOR ANALYSIS (Protected - User & Admin)

### Page Title
"Behavior Analysis"

### Current Status Card

**Display:**
- Behavior State: "Anxious" (large text)
- Heart Rate: "145 BPM" (color-coded chip)
- Confidence Gauge: 78% circular gauge

### ML Predictive Analysis Card

**Title:** "ML Predictive Analysis"

**Description:**
"Static preview of an ML pipeline that learns behavioral patterns from signals like heart-rate variability, motion intensity, rest cycles, and historical events."

**Details (grid layout):**
- **Model:** Gradient Boosting Classifier (offline-trained)
- **Features:** HR mean/variance, HRV, steps/min, rest ratio, event count
- **Predicted State:** Mild Stress
- **Confidence:** 78%
- **1h Risk Forecast:** Low probability of escalation; likely return to baseline after rest

### Historical Trends Chart
- Title: "Historical Trends"
- Line chart showing behavior over past week
- Data points with dates and behavior states
- Shows incident counts

### Incident Reports Section
- Title: "Incident Reports"
- Description: "Detailed logs with timestamps and correlating heart rate (placeholder)"

---

## 9. LIVE HEART RATE (Protected - User & Admin)

### Page Title
"Live Heart Rate"

### Current BPM Card

**Display:**
- Large numeric value: "110 BPM" (updates every second)
- Status chip: "Normal" / "Elevated" / "Critical"
- Status ranges info: "Normal 60-120 • Elevated 120-160 • Critical 160+"

**Status Logic:**
- Normal: 60-120 BPM (green)
- Elevated: 120-160 BPM (yellow)
- Critical: 160+ BPM (red)

### Collar Status Card

**Information:**
- Battery: 72%
- Connection: Online
- Last data: [current timestamp]
- GPS: 12.9716, 77.5946
- Button: "Trigger Calming Sound"

### Real-time Graph

**Title:** "Real-time Graph"

**Chart:**
- Live updating line chart
- Updates every 1 second
- Shows last 60 data points
- X-axis: Time
- Y-axis: BPM (60-180 range)

**Alert Chips Below Chart:**
- "Alert: Elevated HR at 3:02 PM" (warning)
- "Auto Response: Calming sound" (info)

**Behavior:**
- Simulated heart rate with random variations (±10 BPM)
- Auto-scrolling chart
- Maintains 60-point history

---

## 10. DOG PROFILES (Protected - Admin Only)

### Page Header
- Zone selector dropdown: "Zone 1"

### Dog Profile Grid

**Each Profile Card Shows:**
- Dog ID: "DOG001"
- Locked indicator (if applicable)
- Delete button (for unlocked profiles only)

**Default Profiles:**
- DOG001 (locked - cannot delete)
- DOG002 (locked - cannot delete)

**Add Profile Card:**
- Large "+" button
- Text: "Add new Dog ID"

### Add Profile Dialog

**Title:** "Add Dog Profile"

**Form:**
- Dog ID (text input)
- Error message display
- Actions: Cancel, Save

**Behavior:**
- Validate Dog ID is not empty
- Check if ID already exists
- Add to profile list on save
- Close dialog on success

**Profile Management:**
- Cannot delete locked profiles
- Profiles persist across sessions
- Admin-only access

---

## 11. SETTINGS (Protected - User & Admin)

### Page Title
"Settings"

### Notification Preferences Card

**Title:** "Notification Preferences"

**Toggle Switches:**
- Heart rate alerts (default: ON)
- Behavior alerts (default: OFF)
- Medication reminders (default: OFF)

**Behavior:**
- Toggle state persists in session
- Visual feedback on toggle

### Account Management Card (Admin Only)

**Title:** "Account Management"

**Button:** "Change Password"

### Change Password Dialog (Admin Only)

**Title:** "Change Password"

**Form Fields:**
- Current Password (password input)
- New Password (password input)
- Confirm New Password (password input)
- Actions: Cancel, Change Password

**Validation:**
- All fields required
- New passwords must match
- Minimum 6 characters
- Show success/error alerts

**Behavior:**
- Validate old password
- Update password on success
- Auto-close dialog after 2 seconds
- Clear form on close

---

## 12. KEY UX BEHAVIORS

### Real-time Updates
- Heart rate updates every 1 second
- Chart auto-scrolls with new data
- Maintains last 60 data points

### Form Handling
- All inputs are controlled components
- Validation before submission
- Clear error messages
- Success feedback

### Navigation
- Smooth scrolling for anchor links
- Back button on public pages
- Breadcrumb or page title indication
- Mobile-responsive navigation

### Responsive Design
- Mobile-first approach
- Collapsible navigation on small screens
- Stacked layouts on mobile
- Touch-friendly buttons and inputs

### Theme System
- Light and dark mode support
- Toggle button in navigation
- Persistent preference
- Smooth transitions

### Error Handling
- User-friendly error messages
- Validation feedback
- Fallback states
- Clear recovery actions

### Loading States
- Show loading indicators for async operations
- Disable buttons during submission
- Skeleton screens for data loading

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels
- Focus management

---

## 13. DATA & CONTENT REQUIREMENTS

### Dummy Data Needed
- Medical records (5-10 vaccination entries)
- Behavior history (7 days of data)
- Heart rate readings (simulated real-time)
- Alert history (5-10 recent alerts)
- Dog profiles (2 default locked profiles)

### Text Content
- All text content provided in sections above
- Error messages for validation
- Success messages for actions
- Help text for inputs

### Icons/Symbols
- Heart/Pulse for monitoring
- Cloud for storage
- Analytics/Chart for insights
- Shield/Security for privacy
- Email, Phone, Person for contact
- Paw/Pet for pet-related features
- Back arrow for navigation
- Menu hamburger for mobile
- Theme toggle (sun/moon)

---

## IMPLEMENTATION NOTES

1. **No UI specifications** - Use any design system, colors, fonts, spacing you prefer
2. **Focus on UX flow** - Ensure all interactions work as described
3. **Content accuracy** - Use exact text content provided
4. **Functionality first** - All features must work before styling
5. **Responsive** - Must work on mobile, tablet, desktop
6. **Accessible** - Follow basic accessibility guidelines
7. **Performance** - Optimize for smooth real-time updates

Create a modern, professional interface with your own design choices while maintaining the exact UX flow and content structure described above.
