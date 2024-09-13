import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        height: '40px',  // Fixed height for the footer
        width: '100%',   // Full width
        display: 'flex',  // Flexbox to center content
        alignItems: 'center',  // Center content vertically
        justifyContent: 'center',  // Center content horizontally
        position: 'fixed',  // Fixed at the bottom
        bottom: 0,  // Align to bottom
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        textAlign: 'center',  // Center text
        px: 2,  // Padding on the sides
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2024 Villa Booking System. All rights reserved. {' '}
        <Link color="inherit" href="https://mui.com/">
          Powered by React & Material-UI
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
