import React from "react";
import { Box, Link, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from "axios";
const Navbar = () => {
  const theme = useTheme();
  const loggedIn = JSON.parse(localStorage.getItem('authToken'));
  const logoutHandler = async () => {
   try {
     await axios.post('/api/auth/logout').then(res => fullyLogout(res.data ));
   } catch (error) {
     console.error('Logout error:', error);
   }
  }
  const fullyLogout = (data) => {
    if(data.success) {
      localStorage.removeItem('authToken');
      window.location.reload();
    }
  } 
  return (
    <Box width="100%" p={2} bgcolor={theme.palette.background.alt} textAlign="center" sx={{ boxShadow: 3, mb: 2 }} >
      <Typography variant="h4" color="primary" fontWeight="bold" >
        Mern Saas
      </Typography>
      {loggedIn ? (
        <>
          <Link component={RouterLink} to="/summary" p={1} sx={{ ml: 2 }}>
            Summary
          </Link>
          <Link href="/" onClick={logoutHandler} p={2} sx={{ ml: 2 }}>
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link component={RouterLink} to="/register" p={1} sx={{ ml: 2 }}>
            Register
          </Link>
          <Link component={RouterLink} to="/login" p={1} sx={{ ml: 2 }}>
            Login
          </Link>
        </>
      )}
    </Box>
  );
};

export default Navbar;
