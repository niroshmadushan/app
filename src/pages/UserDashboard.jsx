import React, { useState } from 'react';
import { Typography, Box, Grid, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Visibility as VisibilityIcon, Payment as PaymentIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      checkIn: '2023-09-01', 
      checkOut: '2023-09-05', 
      roomType: 'Suite', 
      guests: 2, 
      paymentStatus: 'Paid' 
    },
    { 
      id: 2, 
      checkIn: '2023-09-10', 
      checkOut: '2023-09-15', 
      roomType: 'Double', 
      guests: 3, 
      paymentStatus: 'Pending' 
    }
  ]);

  const handleViewBookings = () => {
    navigate('/user/book'); // Navigate to '/user/book' when button is clicked
  };

  const handleManagePayments = () => {
    navigate('/user/payments'); // Navigate to '/user/payments' when button is clicked
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
            <Typography variant="subtitle1">Total Bookings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{bookings.length}</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }} 
              startIcon={<VisibilityIcon />}
              onClick={handleViewBookings} // Add onClick event for navigation
            >
              View Bookings
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
            <Typography variant="subtitle1">Pending Payments</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {bookings.filter(booking => booking.paymentStatus === 'Pending').length}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }} 
              startIcon={<PaymentIcon />}
              onClick={handleManagePayments} // Add onClick event for navigation
            >
              Manage Payments
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Bookings
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Booking ID</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Check-In</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Check-Out</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Room Type</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Guests</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}>
                  <TableCell align="center">{booking.id}</TableCell>
                  <TableCell align="center">{booking.checkIn}</TableCell>
                  <TableCell align="center">{booking.checkOut}</TableCell>
                  <TableCell align="center">{booking.roomType}</TableCell>
                  <TableCell align="center">{booking.guests}</TableCell>
                  <TableCell align="center">{booking.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default UserDashboard;
