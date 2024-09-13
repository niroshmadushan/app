import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PaymentForm from '../components/PaymentForm'; // Reuse the PaymentForm component

const UserPayments = () => {
  return (
    <Box sx={{ p: 3 }}>
      
        <PaymentForm />
      
    </Box>
  );
};

export default UserPayments;
