import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import BookingForm from '../components/BookingForm'; // Reuse the BookingForm component

const UserBooking = () => {
  return (
    <Box sx={{ p: 3 }}>
      
        <BookingForm />
      
    </Box>
  );
};

export default UserBooking;
