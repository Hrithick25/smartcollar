import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'light' });
export const useColorMode = () => useContext(ColorModeContext);
export const useThemeContext = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  return { toggleTheme: toggleColorMode, mode };
};

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
          primary: { main: mode === 'light' ? '#1d4ed8' : '#66b2ff' }, // light blue
          secondary: { main: mode === 'light' ? '#0ea5e9' : '#64ffda' },
          background: {
            default: mode === 'light' ? '#f5f9ff' : '#0b1220', // soft blue-tint background
            paper: mode === 'light' ? '#ffffff' : '#0f172a',
          },
          text: {
            primary: mode === 'light' ? '#0b1220' : '#e2e8f0',
            secondary: mode === 'light' ? '#475569' : '#94a3b8',
          },
          divider: mode === 'light' ? '#e6eefc' : '#1f2937',
        },
        shape: { borderRadius: 16 },
        typography: {
          fontWeightBold: 800,
        },
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
