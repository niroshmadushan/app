import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Button } from '@mui/material';
import axios from 'axios'; // To fetch data from the backend

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  // Fetch bookings data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost/back/get_dashboard_data.php'); // Adjust path accordingly
        if (response.data.success) {
          setBookings(response.data.bookings);
          console.log(bookings);
          // Calculate dashboard metrics
          setTotalBookings(response.data.bookings.length);
          setPendingPayments(response.data.payments.filter(p => p.paymentStatus === 'Pending').length);
          setActiveUsers(3); // You can fetch active users count similarly if needed
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpen = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {/* Compact Cards for Metrics */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
            <Typography variant="subtitle1">Total Bookings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{totalBookings}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
            <Typography variant="subtitle1">Pending Payments</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{pendingPayments}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
            <Typography variant="subtitle1">Active Users</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{activeUsers}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Beautiful Table for Recent Bookings */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Bookings
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Booking ID</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Guest Name</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Check-In</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Check-Out</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Room Type</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Guests</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} onClick={() => handleOpen(booking)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}>
                  <TableCell align="center">{booking.id}</TableCell>
                  <TableCell align="center">{booking.guestName}</TableCell>
                  <TableCell align="center">{booking.checkIn}</TableCell>
                  <TableCell align="center">{booking.checkOut}</TableCell>
                  <TableCell align="center">{booking.roomType}</TableCell>
                  <TableCell align="center">{booking.guests}</TableCell>
                  <TableCell align="center">{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Beautiful Modal for Booking Details */}
      <Modal open={open} onClose={handleClose}>
        <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 3, width: 400, borderRadius: '8px' }}>
          {selectedBooking && (
            <>
              <Typography variant="h6" gutterBottom>
                Booking Details
              </Typography>
              <Typography variant="body1"><strong>Booking ID:</strong> {selectedBooking.id}</Typography>
              <Typography variant="body1"><strong>Guest Name:</strong> {selectedBooking.guestName}</Typography>
              <Typography variant="body1"><strong>Check-In:</strong> {selectedBooking.checkIn}</Typography>
              <Typography variant="body1"><strong>Check-Out:</strong> {selectedBooking.checkOut}</Typography>
              <Typography variant="body1"><strong>Room Type:</strong> {selectedBooking.roomType}</Typography>
              <Typography variant="body1"><strong>Number of Guests:</strong> {selectedBooking.guests}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {selectedBooking.status}</Typography>
              <Typography variant="body1"><strong>Special Requests:</strong> {selectedBooking.specialRequests}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="success" sx={{ mr: 1 }}>
                  Mark as Paid
                </Button>
                <Button variant="contained" color="warning" sx={{ mr: 1 }}>
                  Mark as Pending
                </Button>
                <Button variant="contained" color="error">
                  Mark as Unpaid
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;
