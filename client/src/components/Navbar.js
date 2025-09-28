import React from "react";
import { Box, Link, Typography, useTheme } from '@mui/material';
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
      {loggedIn ? <Link href="/" onClick={logoutHandler} p={2} >Logout</Link> : <><Link href="/register" p={1} >Register</Link>
      <Link href="/login" p={1} >Login</Link></>}
    </Box>
  );
};

export default Navbar;
