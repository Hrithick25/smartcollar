import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'light' });
export const useColorMode = () => useContext(ColorModeContext);

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === 'light' ? '#1a73e8' : '#66b2ff' },
          secondary: { main: mode === 'light' ? '#00bfa5' : '#64ffda' },
          background: {
            default: mode === 'light' ? '#f7f9fc' : '#0b1220',
            paper: mode === 'light' ? '#ffffff' : '#0f172a',
          },
          text: {
            primary: mode === 'light' ? '#0b0f19' : '#e2e8f0',
            secondary: mode === 'light' ? '#475569' : '#94a3b8',
          },
        },
        shape: { borderRadius: 14 },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
