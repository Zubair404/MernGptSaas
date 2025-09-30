import React from 'react';
import { Box, Link, Typography, useTheme , useMediaQuery , Collapse ,Alert , TextField, Button ,Card} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const SummaryScreen = () => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();

    const [ error, setError ] = React.useState("");
    const [ text, setText ] = React.useState("");
    const [ summary, setSummary ] = React.useState("");

    const summaryHandler = async (e) => {
    e.preventDefault();
    try {
  // send username field (server expects `username`) and call the auth route
        const { data } = await axios.post('/api/openai/summary', { text });
        // server returns { summary } or { summary, fallback, message }
        if (data && data.summary) {
          setSummary(data.summary);
        } else if (data && data.message) {
          setError(data.message);
        } else {
          setError('No summary returned');
        }
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
      <form onSubmit={summaryHandler} >
        <Typography variant="h3" align="center" gutterBottom>Text Summarizer</Typography>
        <TextField label="Text" required value={text} fullWidth margin='normal' onChange={(e) => setText(e.target.value)} />
        <Button variant="contained" color="primary" type="submit" size="large" sx={{ color:'white' }}>Summarize</Button>
      </form>
     {
     summary?
      <Card sx={{ mt: 4, pt: 2 ,border: '1px solid',boxShadow: 'px' ,borderColor: theme.palette.neutral.medium , borderRadius: '10px', height: '500px',  bgcolor: theme.palette.background.default }}>
        <Typography align="center">{summary}</Typography>
      </Card>
      : 
      <Card sx={{ mt: 4, pt: 2 ,border: '1px solid',boxShadow: 'px' ,borderColor: theme.palette.neutral.medium , borderRadius: '10px', height: '500px',  bgcolor: theme.palette.background.default }}>
        <Typography align="center">Summary Will Appear Here</Typography>
      </Card>}
      <Typography mt={2} >Not the Tool you are looking for <Link href="/register">GO BACK</Link></Typography>
    </Box>
  )
};

export default SummaryScreen;
