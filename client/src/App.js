// App.js
import { Routes, Route } from 'react-router-dom';
import { useMemo } from 'react';

// Material-UI
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { themeSettings } from './theme';

// Screens
import Navbar from './components/Navbar';
import HomeScreen from './components/screens/HomeScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';


function App() {
  // If themeSettings is a function that takes a mode:
  const theme = useMemo(() => createTheme(themeSettings()), []);

  // If themeSettings is just an object, do:
  // const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
          </Routes>
      </ThemeProvider>
    </div>
  );
}
export default App;
