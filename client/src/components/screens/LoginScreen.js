import React from 'react';
import { Box, Link, Typography, useTheme , useMediaQuery , Collapse ,Alert , TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
 
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [ error, setError ] = React.useState("");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const loginHandler = async (e) => {
    e.preventDefault();
    try {
  // send username field (server expects `username`) and call the auth route
  const { data } = await axios.post('/api/auth/login', { email, password }, config);
  if(data.token.accessToken) {
    console.log("inside data token");
    localStorage.setItem('authToken', true);
    navigate('/');
    window.location.reload();
  }
    console.log(data);

    } catch (error) {
      console.error('Login error:', error);
      if (error.response.data.error) {
        setError(error.response.data.error);
      } else if (error.message) {
        setError(error.message);
      }
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };
  return (
    <Box width={isNonMobile ? "40%" : "80%"} p="2rem" m="2rem auto" borderRadius={5}  backgroundColor= {theme.palette.background.alt}  sx={{ boxShadow: 5 }}>
  <Collapse in={Boolean(error)}>
   <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
  </Collapse>
      <form onSubmit={loginHandler} >
        <Typography variant="h3" align="center" gutterBottom>Sign In</Typography>
        <TextField label="Email" required value={email} fullWidth margin='normal' onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" required value={password} fullWidth margin='normal' onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" type="submit" size="large" sx={{ color:'white' }}>Login</Button>
      </form>
      <Typography mt={2}>Don't have an account? <Link href="/register">Sign up here</Link></Typography>
    </Box>
  )
};

export default LoginScreen;
