import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AccountSettings from '../components/AccountSettings'; // Reuse the AccountSettings component

const UserAccountSettings = () => {
  return (
    <Box sx={{ p: 3 }}>
      
        <AccountSettings />
     
    </Box>
  );
};

export default UserAccountSettings;
