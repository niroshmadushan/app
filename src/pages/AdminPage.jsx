import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Button } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]); // Bookings array
  const [payments, setPayments] = useState([]); // Payments array
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [BookingInfo, setBookingInfo] = useState([]);
  const [PaymentInfo, setPaymentInfo] = useState([]);
  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      // Fetch booking and payment data from the PHP backend
      const response = await axios.get('http://localhost/back/get_all_booking_payment_details.php');
      
      const bookingData = response.data.bookingData;
      setPaymentInfo(response.data.paymentData);

      // Update state with the last 5 bookings
      setBookings(bookingData.slice(-5));
      
      // Set total bookings count
      setTotalBookings(bookingData.length);

      // Set total unique users count
      const uniqueUsers = new Set(bookingData.map(booking => booking.guestName));
      setTotalUsers(uniqueUsers.size);

      // Set payments data
      setPayments(PaymentInfo);

      // Calculate pending payments
      const pending = PaymentInfo.filter(payment => payment.paymentStatus === 'Pending').length;
      setPendingPayments(pending);

    } catch (error) {
      console.error('Error loading booking or payment data:', error);
      Swal.fire('Error', 'Failed to load booking or payment data.', 'error');
    }
  };

  // Get payment status for a booking
  const getBookingPaymentStatus = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.paymentStatus : 'Unknown';
  };


  const getBookingPaymenid = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.paymentId : 'Unknown';
  };

  const getBookingPaymentmethod = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.paymentMethod : 'Unknown';
  };

  const getBookingPaymentamount = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.amountPaid : 'Unknown';
  };

  const getBookingPaymentdue = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.balanceDue : 'Unknown';
  };

  const getBookingPaymentdate = (bookingId) => {
    const payment = PaymentInfo.find(p => p.bookingId === bookingId);
    return payment ? payment.paymentDate : 'Unknown';
  };

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
      
      </Grid>

      {/* Recent Bookings Table */}
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
                <TableRow key={booking.bookingId} onClick={() => handleOpen(booking)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}>
                  <TableCell align="center">{booking.bookingId}</TableCell>
                  <TableCell align="center">{booking.guestName}</TableCell>
                  <TableCell align="center">{booking.checkInDate}</TableCell>
                  <TableCell align="center">{booking.checkOutDate}</TableCell>
                  <TableCell align="center">{booking.roomType}</TableCell>
                  <TableCell align="center">{booking.numGuests}</TableCell>
                  <TableCell align="center">{getBookingPaymentStatus(booking.bookingId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Booking Details Modal */}
     {/* Booking Details Modal */}
     <Modal open={open} onClose={handleClose}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 3,
            width: { xs: '90%', md: '60%' }, // Adjust width based on screen size
            maxHeight: '90vh', // Make modal responsive to screen height
            overflowY: 'auto', // Allow vertical scrolling
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          {selectedBooking && (
            <>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', borderBottom: '1px solid #ddd', pb: 1 }}>
                Booking Details
              </Typography>
              <Grid container spacing={2}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Guest Name:</Typography>
                  <Typography variant="body2">{selectedBooking.guestName}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>NIC/Passport ID:</Typography>
                  <Typography variant="body2">{selectedBooking.idPassport}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Email:</Typography>
                  <Typography variant="body2">{selectedBooking.guestEmail}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Phone Number:</Typography>
                  <Typography variant="body2">{selectedBooking.guestPhone}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Address:</Typography>
                  <Typography variant="body2">{selectedBooking.address}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Check-In Date:</Typography>
                  <Typography variant="body2">{selectedBooking.checkInDate}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Check-Out Date:</Typography>
                  <Typography variant="body2">{selectedBooking.checkOutDate}</Typography>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Room Type:</Typography>
                  <Typography variant="body2">{selectedBooking.roomType}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Number of Rooms:</Typography>
                  <Typography variant="body2">{selectedBooking.numRooms}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Number of Guests:</Typography>
                  <Typography variant="body2">{selectedBooking.numGuests}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Special Requests:</Typography>
                  <Typography variant="body2">{selectedBooking.specialRequests}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Arrival Time:</Typography>
                  <Typography variant="body2">{selectedBooking.arrivalTime}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Departure Time:</Typography>
                  <Typography variant="body2">{selectedBooking.departureTime}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Arrival Meal:</Typography>
                  <Typography variant="body2">{selectedBooking.arrivalMeal}</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>Departure Meal:</Typography>
                  <Typography variant="body2">{selectedBooking.departureMeal}</Typography>
                </Grid>
              </Grid>

              {/* Payment Details */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Amount Paid:</Typography>
                  <Typography variant="body2">{getBookingPaymentamount(selectedBooking.bookingId)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Payment Status:</Typography>
                  <Typography variant="body2">{getBookingPaymentStatus(selectedBooking.bookingId)}</Typography>
                </Grid>

                {/* Conditional Payment Date */}
                {getBookingPaymentdate(selectedBooking.bookingId) && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Payment Date:</Typography>
                      <Typography variant="body2">{getBookingPaymentdate(selectedBooking.bookingId)}</Typography>
                    </Grid>
                  </>
                )}

                {/* Conditional Balance Due */}
                {getBookingPaymentdue(selectedBooking.bookingId) && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Balance Due:</Typography>
                      <Typography variant="body2">{getBookingPaymentdue(selectedBooking.bookingId)}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Button to generate PDF */}
            
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;
