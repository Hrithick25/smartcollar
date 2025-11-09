import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AppThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProfilesProvider } from '@/context/ProfilesContext';
import '@/services/firebase';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppThemeProvider>
      <AuthProvider>
        <ProfilesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProfilesProvider>
      </AuthProvider>
    </AppThemeProvider>
  </React.StrictMode>
);
