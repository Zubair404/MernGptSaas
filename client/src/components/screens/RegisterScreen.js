import React from 'react';
import { Box, Link, Typography, useTheme , useMediaQuery , Collapse ,Alert , TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterScreen = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [user, setUser] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const [ error, setError ] = React.useState("");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const registerHandler = async (e) => {
    e.preventDefault();
    try {
  // send username field (server expects `username`) and call the auth route
  await axios.post('/api/auth/register', { username: user, email, password }, config);
  navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
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
    <Box width={isNonMobile ? "50%" : "90%"} p="2rem" m="2rem auto" borderRadius={5}  backgroundColor= {theme.palette.background.alt}  sx={{ boxShadow: 5 }}>
  <Collapse in={Boolean(error)}>
   <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
  </Collapse>
      <form onSubmit={registerHandler} >
        <Typography variant="h3" align="center" gutterBottom>Sign Up</Typography>
        <TextField label="Username" required value={user} fullWidth margin='normal' onChange={(e) => setUser(e.target.value)} />
        <TextField label="Email" required value={email} fullWidth margin='normal' onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" required value={password} fullWidth margin='normal' onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" type="submit" size="large" sx={{ color:'white' }}>Submit</Button>
      </form>
      <Typography mt={2}>Already have an account? <Link href="/login">Login here</Link></Typography>
    </Box>
  )
};

export default RegisterScreen;
