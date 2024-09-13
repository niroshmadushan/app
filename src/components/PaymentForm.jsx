import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, MenuItem, Typography, Paper, Grid, InputAdornment
} from '@mui/material';
import { CreditCard as CreditCardIcon, AttachMoney as MoneyIcon, DateRange as DateRangeIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';

const PaymentForm = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    bookingId: '',
    paymentMethod: '',
    amountPaid: 0,
    balanceDue: 0,
    paymentDate: '',
    paymentStatus: 'Pending',
  });

  const [bookingInfo, setBookingInfo] = useState([]); // To hold all booking data from book.txt
  const [paymentInfo, setPaymentInfo] = useState([]); // To hold all payment data from payment.txt
  const [isPaid, setIsPaid] = useState(false); // To track if the booking is already paid
  const [isEditable, setIsEditable] = useState(true); // To manage the form's editable state

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost/back/get_all_booking_payment_details.php');
      setBookingInfo(response.data.bookingData);
      setPaymentInfo(response.data.paymentData);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch booking and payment details!',
      });
    }
  };
  // Fetch all booking and payment details from the server on component mount
  useEffect(() => {
 
    fetchData();
  }, []);

  const handleChange = (e) => {
    fetchData();
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
    
    // Check payment status when booking ID is changed
    if (name === 'bookingId') {
      const payment = paymentInfo.find((p) => p.bookingId === value);
      if (payment && payment.paymentStatus === 'Paid') {
        setIsPaid(true);
        setIsEditable(false);  // Disable fields if already paid
      } else {
        setIsPaid(false);
        setIsEditable(true);  // Enable fields if not paid
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!paymentDetails.bookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a valid Booking ID!',
      });
      return;
    }
  
    if (isPaid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'This booking has already been paid!',
      });
      return;
    }
  
    try {
      const response = await axios.post('http://localhost/back/update_payment.php', paymentDetails);
  
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Payment updated successfully!',
        });
  
        // Clear the form after successful submission
        setPaymentDetails({
          bookingId: '',
          paymentMethod: '',
          amountPaid: 0,
          balanceDue: 0,
          paymentDate: '',
          paymentStatus: 'Pending',
        });
  
        // Optionally refresh the data
        fetchData();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update the payment. Please try again.',
      });
    }
  };
  

  const getBookingDetails = (bookingId) => {
    const booking = bookingInfo.find((b) => b.bookingId === bookingId);
    const payment = paymentInfo.find((p) => p.bookingId === bookingId);
    return { booking, payment };
  };

  const selectedBooking = getBookingDetails(paymentDetails.bookingId);

  return (
    <Box sx={{ mt: '-1', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <Grid container spacing={4} sx={{ maxWidth: '1000px' }}>
        {/* Left Side: Payment Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" gutterBottom>
              Payment Form
            </Typography>

            {isPaid ? (
              <Typography variant="h6" color="error" gutterBottom>
                *This booking has already been paid. You cannot be able new payment for this booking.
              </Typography>
            ) : null}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Booking ID"
                name="bookingId"
                value={paymentDetails.bookingId}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Payment Method"
                name="paymentMethod"
                value={paymentDetails.paymentMethod}
                onChange={handleChange}
                select
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditable} // Disable if paid
              >
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Online Payment">Online Payment</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Amount Paid"
                name="amountPaid"
                value={paymentDetails.amountPaid}
                onChange={handleChange}
                type="number"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditable} // Disable if paid
              />
              <TextField
                fullWidth
                label="Balance Due"
                name="balanceDue"
                value={paymentDetails.balanceDue}
                onChange={handleChange}
                type="number"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditable} // Disable if paid
              />
              <TextField
                fullWidth
                type="date"
                label="Payment Date"
                name="paymentDate"
                value={paymentDetails.paymentDate}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRangeIcon />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditable} // Disable if paid
              />
              <TextField
                fullWidth
                label="Payment Status"
                name="paymentStatus"
                value={paymentDetails.paymentStatus}
                onChange={handleChange}
                select
                sx={{ mb: 2 }}
                disabled={!isEditable} // Disable if paid
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
              </TextField>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={!isEditable}>
                Submit Payment
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side: Booking and Guest Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3,width:'100%', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" gutterBottom>
              Booking & Guest Details
            </Typography>
            {selectedBooking && selectedBooking.booking ? (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}><Typography variant="body1"><strong>Guest Name:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.guestName}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Guest Phone:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.guestPhone}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Guest Email:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.guestEmail}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>ID/Passport:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.idPassport}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Address:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.address}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Check-In Date:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.checkInDate}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Check-Out Date:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.checkOutDate}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Room Type:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.roomType}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Number of Rooms:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.numRooms}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Guests:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.numGuests}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Arrival Time:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.arrivalTime}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Departure Time:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.departureTime}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Arrival Meal:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.arrivalMeal}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Departure Meal:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.departureMeal}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1"><strong>Special Requests:</strong></Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{selectedBooking.booking.specialRequests}</Typography></Grid>
                </Grid>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Enter a valid Booking ID to see details.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentForm;
